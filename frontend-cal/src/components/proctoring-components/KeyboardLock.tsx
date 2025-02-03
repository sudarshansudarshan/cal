// Author Akash Kumar
import { useEffect, useState } from "react";

const KeyboardLock = () => {
    const [isLocked, setIsLocked] = useState(true); // Set initial state to true

    useEffect(() => {
        const disableKeyboard = (event: KeyboardEvent): void => {
            if (isLocked) {
            event.preventDefault();
            event.stopPropagation();
            }
        };

        window.addEventListener("keydown", disableKeyboard, true);
        window.addEventListener("keyup", disableKeyboard, true);
        window.addEventListener("keypress", disableKeyboard, true);

        return () => {
            window.removeEventListener("keydown", disableKeyboard, true);
            window.removeEventListener("keyup", disableKeyboard, true);
            window.removeEventListener("keypress", disableKeyboard, true);
        };
    }, [isLocked]);

    return (
        <div className="keyboard-lock">
        </div>
    );
};

// Explain what this component does
// This component locks the keyboard input on the webpage by preventing default keyboard events.
// It sets an initial state `isLocked` to `true`.
// The `useEffect` hook adds event listeners for keydown, keyup, and keypress events.
// When the keyboard is locked, the `disableKeyboard` function is called to prevent the default behavior of the keyboard events.
// The component returns an empty div with the class `keyboard-lock`.
// This component can be used to restrict keyboard input during specific activities or exams.
// It helps prevent users from interacting with the webpage using the keyboard.
// The component can be toggled on and off based on the application requirements.
// It provides a simple way to control user input and enforce specific behaviors on the webpage.
// The component can be customized to allow specific key combinations or actions while blocking others.
// It enhances the security and integrity of the application by restricting unauthorized keyboard input.
// The component can be integrated into proctoring systems or secure environments to prevent cheating or unauthorized actions.
// It demonstrates how to manage keyboard input in a web application using React hooks and event listeners.
// The component can be extended with additional features such as password protection or access control.
// It showcases the use of event handling and state management to control user interactions on the webpage.
// The component is a useful tool for implementing keyboard restrictions in web applications.
// It can be combined with other security measures to enhance the user experience and protect sensitive information.
// The component is a lightweight solution for managing keyboard input without complex configurations.
// It provides a seamless way to restrict user input and enforce specific rules on the webpage.
// The component can be further optimized for performance and compatibility with different browsers.

export default KeyboardLock;
