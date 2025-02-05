// UserProfile.jsx
import { User_Data } from '../../endpoints/api';
import './css/profile.css';
import { useState, useEffect } from 'react';

const UserProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const skills = [
      "JavaScript",
      "React",
      "CSS",
      "HTML",
      "Python",
      "Django",
      "REST API",
      "Git"
    ];

    const description = "Passionate full-stack developer with expertise in building scalable web applications and intuitive user interfaces.";

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await User_Data(); // Ensure User_Data() is an async function returning data
          if (res) {
            setName(res.username);
            setEmail(res.email); // Fix: Use res.email instead of res.username
            console.log("Fetched Data:", res); // Log the response instead
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }, []);


  return (
      <div className="user-profile-container">
        <img src="" alt="User Profile" className="user-profile-image" />
        <div className="user-profile-details">
          <h2 className="user-profile-name">{name}</h2>
          <p className="user-profile-email">{email}</p>
          <p className="user-profile-description">{description}</p>
          <div className="user-profile-skills">
            <h3>Skills:</h3>
            <ul>
              {skills.map((skill, index) => (
                <li key={index} className="skill-tag">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
};

export default UserProfile;