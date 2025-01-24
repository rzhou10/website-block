/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
  display: none;
}`;

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
  document.addEventListener("click", (e) => {

    const url = document.getElementById('url-to-add')

    function addUrl(tabs) {
      browser.tabs.insertCSS({ code: hidePage }).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "urlToBlock",
          websiteUrl: url,
        });
      });
    }

    function block(tabs) {
      browser.tabs.removeCSS({ code: hidePage }).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "block-url",
        });
      });
    }

    /**
    * Just log the error to the console.
    */
    function reportError(error) {
      console.error(`Could not block this page: ${error}`);
    }

    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    }
    // add url to be blocked
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(addUrl)
        .catch(reportError);
    // block on load
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(block)
        .catch(reportError);
  });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute website block content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs
  .executeScript({ file: "/content_scripts/block.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
