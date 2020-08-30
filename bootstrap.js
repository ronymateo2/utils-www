import { send } from "./utils.facade";

const form = document.getElementById("formElem");
const resultContainer = document.getElementById("result");

form.onsubmit = async (event) => {
  event.preventDefault();
  const issueType = document.activeElement.value;
  let data = new FormData(formElem);
  let name = data.get("name");
  let issue = issueType === "Bugfix" ? "BugFix" : "Feature";

  let msg = {
    type: "dashed",
    args: [name, issue],
  };

  const { value } = await send(msg);
  resultContainer.innerText = value;
};
