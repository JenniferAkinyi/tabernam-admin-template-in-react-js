import React, { useState } from 'react';
import { db, storage, uploadImage } from '../../firebase'; // Ensure you import your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './Announcement.css';

const Announcement = () => {
  const [announcement, setAnnouncement] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        const storageRef = ref(storage, `announcements/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'Announcements'), {
        announcement,
        imageUrl,
        timestamp: new Date(),
      });

      setSuccess('Announcement posted successfully');
      setAnnouncement('');
      setImage(null);
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
        
        <Link to='/'>
            <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Submit'}
            </button>
        </Link>
      </form>
    </div>
  );
};

export default Announcement;
