import "@/assets/main.css"
import { useState } from 'react';

const ZenUI = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followedCount, setFollowedCount] = useState(0); // Counter for followed users
  const [isStopped, setIsStopped] = useState(false); // To track if following is stopped


  // Function to create and show the popup
  const showPopup = (message: string) => {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    popup.style.color = 'white';
    popup.style.fontSize = '18px';
    popup.style.borderRadius = '10px';
    popup.style.display = 'none'; // Initially hidden
    document.body.appendChild(popup);
    popup.textContent = message;
    popup.style.display = 'block';

    setTimeout(() => {
      popup.style.display = 'none';
    }, 3000);
  };


  // Function to check if we are on the "For You" tab
  const isOnForYouTab = () => {
    const forYouTab = document.querySelector('a[aria-selected="true"] span');
    return forYouTab && forYouTab.textContent?.trim() === "For you";
  };


  // Function to switch to the "For You" tab if not already on it
  const switchToForYouTab = () => {
    const allTabs = document.querySelectorAll('a[role="tab"]');
    let forYouTabFound = false;

    allTabs.forEach((tab) => {
      const span = tab.querySelector('span');
      if (span && span.textContent?.trim() === "For you") {
        // If this is the "For You" tab, mark it as selected
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        forYouTabFound = true;

        // Simulate a click to ensure it's activated
        (tab as HTMLElement).click();
      } else {
        // For all other tabs, mark them as not selected
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    });

    if (forYouTabFound) {
      console.log('Switched to "For You" tab.');
    } else {
      console.warn('"For You" tab not found.');
    }
  };

  // Function to automate following a user
  const autoFollow = (username: string, attempt = 1) => {
    if (isStopped) return; // If stopped, exit the function immediately

    // Select the user element based on the username
    const userElement = document.querySelector(
      `div[data-testid="UserAvatar-Container-${username}"]`
    );

    if (!userElement) {
      console.error(`User element for "${username}" not found.`);
      return;
    }

    // Scroll to the user element
    userElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Simulate hover to display the follow button popup
    userElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    // Use setInterval to keep checking for the Follow button
    const checkButtonInterval = setInterval(() => {
      if (isStopped) {
        clearInterval(checkButtonInterval); // Stop the interval when following is stopped
        return;
      }

      const followButton = document.querySelector(
        `button[aria-label^="Follow @${username}"], button[aria-label^="Following @${username}"]`
      );

      if (followButton) {
        if ((followButton as HTMLElement).innerText.trim() === 'Follow') {
          (followButton as HTMLElement).click();
          setFollowedCount((prevCount) => prevCount + 1); // Increment the followed count
          console.log(`Successfully followed ${username}`);
          clearInterval(checkButtonInterval);
        } else if ((followButton as HTMLElement).innerText.trim() === 'Following') {
          console.log(`Already following ${username}`);
          clearInterval(checkButtonInterval);
        } else {
          console.log(`Unexpected button state: "${(followButton as HTMLElement).innerText.trim()}"`);
        }
        clearInterval(checkButtonInterval);
      } else {
        console.log(`Follow button not yet available for "${username}". Retrying...`);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(checkButtonInterval);
      console.error(`Failed to follow "${username}" within timeout.`);
    }, 3000);

    setTimeout(() => {
      userElement.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
      console.log(`Closed popup for ${username}`);
    }, 2500);

    if (attempt === 2) return;
  };

  // Function to follow all users
  const followAllUsers = () => {


    const followButtons = Array.from(
      document.querySelectorAll('div[data-testid="cellInnerDiv"] a[href^="/"]')
    );
    const usernamesToFollow = followButtons.map((button) => {
      const username = button.getAttribute('href')?.split('/')[1] || '';
      return username;
    });

    showPopup(`Following ${usernamesToFollow.length} users... Please wait.`);

    let currentUserIndex = 0;

    const followNextUser = () => {
      if (isStopped || currentUserIndex >= usernamesToFollow.length) return; // Stop if stopped or no more users

      const username = usernamesToFollow[currentUserIndex];
      autoFollow(username, 1); // First attempt
      setTimeout(() => {
        autoFollow(username, 2); // Second attempt after a delay
      }, 2000); // Delay between attempts

      currentUserIndex++;
      setTimeout(followNextUser, 5000); // Move to next user after 5 seconds
    };

    followNextUser();
  };

  // Function to handle the button click to start following all users
  const handleFollowAllClick = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      // Check if we're on the "For You" tab
      if (!isOnForYouTab()) {
        switchToForYouTab();
        setTimeout(followAllUsers, 5000); // Wait for the tab switch;
      } else {
        followAllUsers(); // Proceed if already on For You tab
      }
    }
  };

  // Function to stop the following process
  const handleStopClick = () => {
    setIsStopped(true);
    setIsFollowing(false);
    showPopup('Following process has been stopped.');
    setTimeout(() => {
      window.location.reload(); // Reset the followed count
    }
      , 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end space-y-4">
      <div className="bg-emerald-500 rounded-lg shadow-lg px-4 py-2 text-white font-medium">
        Users followed: {followedCount}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleStopClick}
          disabled={!isFollowing || isStopped}
          className={`px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200
            ${!isFollowing || isStopped
              ? 'bg-red-500/50 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 active:scale-95'
            }
            text-white`}
        >
          Stop
        </button>

        <button
          onClick={handleFollowAllClick}
          disabled={isFollowing || isStopped}
          className={`px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200
            ${isFollowing || isStopped
              ? 'bg-blue-500/50 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
            }
            text-white`}
        >
          {isFollowing ? 'Following...' : 'Follow All'}
        </button>
      </div>
    </div>
  );
};

export default ZenUI;
