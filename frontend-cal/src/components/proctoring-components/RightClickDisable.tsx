// Akash Kumar
import { useEffect } from "react";

const RightClickDisabler = () => {
  useEffect(() => {
    // Disable right-click functionality
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Add event listener on mount
    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null; // No UI is rendered by this component
};

// Explain what this component does
// This component disables the right-click context menu on the webpage.
// It adds an event listener to prevent the default behavior of the contextmenu event.
// When a user tries to right-click on the webpage, the context menu will not appear.
// This component is useful for preventing users from accessing browser features like saving images or inspecting elements.
// It can be used to protect content or prevent unauthorized actions on the webpage.
// The component does not render any UI elements and only handles the right-click event.
// It provides a simple way to restrict user interactions and enhance the security of the application.
// The component can be customized or extended to handle other mouse events or interactions.
// It demonstrates how to manage mouse events in a React component to control user actions.
// The component can be integrated into applications that require restricted user interactions.
// It enhances the user experience by enforcing specific behaviors on the webpage.
// The component is lightweight and does not impact the performance of the application.

export default RightClickDisabler;
