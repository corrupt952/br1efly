import { fetchHistories } from "@/libs/history";

async function renderHistories() {
  const elem = document.getElementById("histories");
  const histories = await fetchHistories();

  const tbody = elem?.getElementsByTagName("tbody")[0] as HTMLTableSectionElement;
  histories.forEach((history) => {
    const tr = document.createElement("tr");
    ["url", "type", "selection", "messages", "result"].forEach((key) => {
      const td = document.createElement("td");
      const value = history[key];
      if (typeof value === "object") {
        td.innerText = JSON.stringify(value);
      } else {
        td.innerText = value;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistories();
});
