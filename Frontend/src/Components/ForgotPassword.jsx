import React, { useState } from 'react';

export default function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendCode = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setError('');
    setSuccess('Verification code sent to your email.');
    setCodeSent(true);
  };

  const handleResetPassword = () => {
    if (!code || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccess('Password reset successful!');
    setTimeout(() => {
      onBackToLogin();
    }, 1500);
  };

  return (
    <div className="box" style={{height:'80%'}}>
      <h1  style={{ marginBottom:'20px',fontSize:'30px',textAlign:'center' }}>Reset Password</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!codeSent && (
          <button type="button" onClick={handleSendCode}>
            Send Code
          </button>
        )}

        {codeSent && (
          <>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button" onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        {error && <p style={{ color: 'orange',margin:'0' ,marginTop:'10px' }}>{error}</p>}
        {success && <p style={{ color: 'cyan',marginTop:'10px' }}>{success}</p>}
      </form>
      <p className="bottomtext">
        <a href="#" onClick={onBackToLogin}>
          Back to Login
        </a>
      </p>
    </div>
  );
}
