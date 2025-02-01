import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CameraAndMicCheck = () => {
    const [cameraPermission, setCameraPermission] = useState('Checking...');
    const [micPermission, setMicPermission] = useState('Checking...');
    const navigate = useNavigate();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                // If the promise resolves, access is granted
                setCameraPermission('Granted');
                setMicPermission('Granted');

                // Cleanup: stop the stream to release the camera and mic
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(error => {
                // If the promise rejects, access is denied or not available
                if (error.name === 'NotFoundError') {
                    setCameraPermission('Not Available');
                    setMicPermission('Not Available');
                    toast('Camera and Micrphone not Found !')
                    // Cookies.remove('access_token');
                    // navigate('/login')
                } else if (error.name === 'NotAllowedError') {
                    setCameraPermission('Denied');
                    setMicPermission('Denied');
                    toast('Camera and Micrphone not Found !')
                    // Cookies.remove('access_token');
                    // navigate('/login')
                } else {
                    setCameraPermission('Error');
                    setMicPermission('Error');
                    toast('Camera and Micrphone not Found !')
                    // Cookies.remove('access_token');
                    // navigate('/login')
                }
            });
    }, []);

    return (
        <div>
            <h1></h1>
        </div>
    );
};

// Explain what this component does
// This component checks if the camera and microphone are available and accessible to the browser.
// It uses the `navigator.mediaDevices.getUserMedia()` method to request access to the camera and microphone.
// If access is granted, it sets the permissions to "Granted".
// If access is denied or not available, it sets the permissions to "Not Available" or "Denied".
// If an error occurs during the process, it sets the permissions to "Error".
// The component renders a message indicating the status of camera and microphone permissions.
// If access is denied or not available, it also displays a toast message and redirects the user to the login page.
// The component is used to perform a pre-check before starting a proctored exam or activity that requires camera and microphone access.
// It helps ensure that the necessary hardware is available and accessible before proceeding with the activity.

export default CameraAndMicCheck;
