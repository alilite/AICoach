import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/ContactUs.css';

const ContactUs = () => {
  // State for form inputs
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // Tracks if the form has been successfully submitted
  const [submitted, setSubmitted] = useState(false);

  // Update form state when user types in any input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send email using EmailJS when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        () => {
          setSubmitted(true); // Show thank-you message
          setForm({ name: '', email: '', message: '' }); // Reset form
        },
        (error) => {
          console.error('Email error:', error);
          alert('❌ Failed to send message. Please try again later.');
        }
      );
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>📬 Contact Us</h2>

      {/* Description of the project and team */}
      <p>
        This website was developed by <strong>Ali</strong>, <strong>Erfan</strong>, 
        <strong> Mohammad Adril</strong>, and <strong>George</strong>.
      </p>
      <p>
        Our platform is an AI-powered fitness assistant that helps you generate personalized 
        <strong> diet plans</strong>, <strong> workout routines</strong>, chat with an intelligent coach, 
        and track your fitness journey — all in one place.
      </p>

      <hr style={{ margin: '20px 0' }} />

      <h3>Get in Touch</h3>

      {/* Show thank-you message if submitted, else show the form */}
      {submitted ? (
        <div style={{
          padding: '12px',
          backgroundColor: '#dff0d8',
          color: '#3c763d',
          border: '1px solid #d6e9c6',
          borderRadius: '5px',
          fontWeight: '500'
        }}>
          ✅ Thank you for reaching out! We'll get back to you shortly.
        </div>
      ) : (
        // Contact form
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            required
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            required
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            required
            onChange={handleChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#ff2625',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactUs;
