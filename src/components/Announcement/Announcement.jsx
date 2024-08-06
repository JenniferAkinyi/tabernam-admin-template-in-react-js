import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'; 
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './Announcement.css';

const Announcement = () => {
  const [announcement, setAnnouncement] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nextNumber, setNextNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const q = query(collection(db, 'Announcements'), orderBy('Number', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setNextNumber(1);
        } else {
          const latestAnnouncement = querySnapshot.docs[0].data();
          setNextNumber(latestAnnouncement.Number + 1);
        }
      } catch (error) {
        console.error('Error fetching the latest announcement number:', error);
        setError('Failed to load announcements. Please try again.');
      }
    };

    fetchNextNumber();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = '';

      if (image) {
        const storageRef = ref(storage, `Announcement/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'Announcements'), {
        announcement,
        imageUrl,
        Number: nextNumber,
      });

      setSuccess('Announcement posted successfully');
      setAnnouncement('');
      setImage(null);

      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error posting announcement:', error);
      setError('Failed to post announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcement">
      <h1>Post Announcement</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="announcement-field">
          <input type="file" onChange={handleImageChange} />
        </div>
        <div className="announcement-field">
          <textarea
            placeholder="Enter your announcement"
            value={announcement}
            onChange={handleAnnouncementChange}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Announcement;
