import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:5000/users/${editingId}`, { username, email })
        .then(response => {
          setUsername('');
          setEmail('');
          setEditingId(null);
          fetchUsers();
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
    } else {
      axios.post('http://localhost:5000/users', { username, email })
        .then(response => {
          setUsername('');
          setEmail('');
          fetchUsers();
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setEditingId(user.id);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:5000/users/${userId}`)
        .then(response => {
          fetchUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">{editingId ? 'Update User' : 'Ad User'}</button>
        
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>users</p>

    </div>
  );
};

export default UserManagement;
