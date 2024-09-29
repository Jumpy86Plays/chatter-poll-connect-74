import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellIcon } from 'lucide-react';

const Notification = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('new notification', (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      });
    }
    return () => {
      if (socket) {
        socket.off('new notification');
      }
    };
  }, [socket]);

  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.sender !== notification.sender)
    );
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        {notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full mb-2 text-left flex items-center"
              onClick={() => handleNotificationClick(notification)}
            >
              <BellIcon className="mr-2 h-4 w-4" />
              {notification.sender} sent a message
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default Notification;