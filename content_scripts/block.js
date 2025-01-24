(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;


  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "urlToBlock") {
      urls.push(message.websiteUrl);
    } else if (message.command === "block-url") {
      // block the element on load
      if (urls.include()) {
        const body = document.getElementsByTagName("body");
        body.replaceChildren();
        const div = document.createElement('div');
        div.innerHTML = "Please get a life"
        body.appendChild(div);
      }
    }
  });
})();