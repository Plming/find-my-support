const encodedKey =
  "%2BOmZwGtXsknyxv6rDTAaEYwvWX9nyzMzdfeKCwECKPkxmGmTu7ozWgcZM5yAc9NnQF0h5z08B2d8cYY4KU5jzA%3D%3D";
const decodedKey =
  "+OmZwGtXsknyxv6rDTAaEYwvWX9nyzMzdfeKCwECKPkxmGmTu7ozWgcZM5yAc9NnQF0h5z08B2d8cYY4KU5jzA==";

const base = "https://api.odcloud.kr/api/gov24/v1";
const params = new URL(document.location).searchParams;

const target = `${base}/serviceList?page=1&perPage=10&serviceKey=${encodedKey}`;

async function canServiced(serviceId) {
  const response = await fetch(
    `${base}/supportConditions?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${serviceId}&serviceKey=${encodedKey}`
  );
  const json = await response.json();

  let conditions = json.data[0];

  // TODO: api returns empty data
  if (conditions == undefined) {
    return true;
  }

  for (const [_, value] of params) {
    if (value === "") {
      continue;
    }

    if (conditions[value] !== "Y") {
      return false;
    }
  }

  return true;
}

window.onload = () => {
  // query string test
  /*
    const queryDiv = document.getElementById("query-test");

    for (const [key, value] of params) {
        let child = document.createElement("p");
        child.append(`${key}: ${value}`);
        queryDiv.append(child);
    }
    */

  // api call test
  const apiDiv = document.getElementById("api-call-test");
  var count = 0;

  fetch(target)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then((myJson) => {
      const node = document.getElementById("node");
      data = myJson.data;
      for (let i = 0; i < data.length; ++i) {
        // 새로운 열을 복제하고 테이블에 삽입합니다
        let clone = document.importNode(node.content, true);
        //clone.setAttribute('onclick', `location.href=${data[i]['상세조회URL']}`);
        clone.querySelector("h3").textContent = data[i]["서비스명"];
        clone.querySelector("h4").textContent = data[i]["부서명"];

        apiDiv.append(clone);
        ++count;
        if (count > 4) {
          return;
        }

        /*
                                let child = document.createElement("ul");
                                for (let key in data[i]) {
                                    let li = document.createElement('li');
                                    li.append(`${key}: ${data[i][key]}`);
                                    child.appendChild(li);
                                }
                                */

        canServiced(data[i]["서비스ID"]).then((result) => {
          if (!result) {
            child.style.backgroundColor = "orange";
          }
        });
      }
    });
};
