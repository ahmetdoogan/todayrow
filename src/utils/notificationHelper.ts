// Notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    try {
      new Notification(title, options);
      return true;
    } catch (error) {
      console.error("Error showing notification:", error);
      return false;
    }
  }
  return false;
};

// Play sound
export const playSound = (soundType: 'pomodoro' | 'break' = 'break') => {
  try {
    // Sound file path
    const soundPath = soundType === 'pomodoro' 
      ? '/sounds/Marimba Notification.wav'
      : '/sounds/Neutral Notification.wav';
      
    // Check if sound file exists first by making a HEAD request
    fetch(soundPath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const audio = new Audio(soundPath);
          audio.volume = 0.5; // Set volume to 50%
          audio.play().catch(err => console.error("Error playing sound:", err));
        } else {
          console.warn(`Notification sound file not found. Please add a sound file at ${soundPath}`);
          // Fallback using a simple beep sound through Web Audio API
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          
          // Pomodoro için biraz farklı ton kullan
          if (soundType === 'pomodoro') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(900, audioContext.currentTime);
          } else {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          }
          
          const gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
        }
      })
      .catch(err => {
        console.error("Error checking sound file:", err);
      });
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};

// Combined notification with sound
export const notifyWithSound = (title: string, options?: NotificationOptions, soundType: 'pomodoro' | 'break' = 'break') => {
  playSound(soundType);
  showNotification(title, options);
};
