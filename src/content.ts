import { completions } from "@/libs/completions";

/**
 * Show dialog to indicate processing
 *
 * @param {*} x
 * @param {*} y
 */
function showProcessing(x: number, y: number) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "black";
  div.innerText = "Processing...";
  document.body.appendChild(div);
  return div;
}

/**
 * Show the output in a popup
 *
 * @param {*} output
 * @param (*) x
 * @param {*} y
 */
function popupOutput(output: string, x: number, y: number) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.style.zIndex = "1000";
  div.style.color = "black";
  div.innerText = output;
  // br
  div.appendChild(document.createElement("br"));
  // Close button
  const closeButton = document.createElement("button");
  closeButton.style.backgroundColor = "grey";
  closeButton.style.borderRadius = "5px";
  closeButton.style.color = "black";
  closeButton.style.padding = "5px";
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(div);
  });
  div.appendChild(closeButton);
  // Copy to clipboard button
  const copyButton = document.createElement("button");
  copyButton.style.backgroundColor = "grey";
  copyButton.style.borderRadius = "5px";
  copyButton.style.color = "black";
  copyButton.style.padding = "5px";
  copyButton.innerText = "Copy to clipboard";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(output);
  });
  div.appendChild(copyButton);
  document.body.appendChild(div);

  // Adjust the position of the popup
  // If the popup is out of the window, move it inside
  const rect = div.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    div.style.left = `${window.innerWidth - rect.width}px`;
  }
  if (rect.bottom > window.innerHeight) {
    div.style.top = `${window.innerHeight - rect.height}px`;
  }
}

/**
 * Listen to the message from the background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const selection = window.getSelection();
  const range = selection!.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.pageXOffset;
  const y = rect.bottom + window.pageYOffset;

  const processing = showProcessing(x, y);
  completions(request.type, request.text)
    .then((result) => {
      popupOutput(result, x, y);
    })
    .catch((error) => {
      console.error(`error: ${JSON.stringify(error)}`);
    })
    .finally(() => {
      document.body.removeChild(processing);
    });
});
