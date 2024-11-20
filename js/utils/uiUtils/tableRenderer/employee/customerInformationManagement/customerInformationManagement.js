import { fetchGetAllCustomerInformation } from "../../../../apiUtils/apiDocumentation/employee/customerInformationManagement/customerInformationManagement.js";
import { BUTTON } from '../../../../../../config/common.js';
import { COMBOBOX } from '../../../../../../config/employee/customerInformationManagement/customerInformationManagement.js';
import { TABLE_TITLE } from '../../../../../../config/employee/customerInformationManagement/customerInformationManagement.js';
import { COLUMN_NAME } from '../../../../../../config/employee/customerInformationManagement/customerInformationManagement.js';

const customerInformationRow = (dto) => {
  return `
    <td>${dto.name}</td>
    <td>${dto.phoneNumber}</td>
    <td>${dto.job}</td>
    <td>${dto.age}</td>
    <td>${dto.gender}</td>
    <td>${dto.residentRegistrationNumber}</td>
    <td>${dto.address}</td>
    <td>${dto.bankName}</td>
    <td>${dto.bankAccount}</td>
    <td>${dto.id}</td>
  `;
}

const context = {
  CUSTOMERINFORMATION_LIST: {
    title: "고객 정보 리스트",
    listFetch: fetchGetAllCustomerInformation,
    rowGetter: customerInformationRow,
    comboListFetch: {}
  }
}


export const viewCustomerInformationListAll = async () => {
  try {
    const list = await fetchGetAllCustomerInformation();
    if (!list || !list.length) {
      console.warn("No customer information data fetched.");
      return;
    }
    sessionStorage.setItem("list", JSON.stringify(list));
    console.log("Data saved in sessionStorage:", sessionStorage.getItem("list"));
    window.location.href = "informationList.html"; // 경로 확인 필요
  } catch (error) {
    console.error("Error fetching customer information:", error);
  }
};

export const renderTable = () => {
  initialTable();
}

const setTitle = () => {
  const title = TABLE_TITLE["CUSTOMERINFORMATION_LIST"];
  const contextTitle = document.getElementById("title");
  contextTitle.innerText = title;
};

const setInput = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.id = "searchInput";
  input.placeholder = "검색어 입력";
  return input;
};

const setComboBox = () => {
  const boxContext = COMBOBOX["CUSTOMERINFORMATION_LIST"];
  if (!boxContext.isCombo) return null;

  const select = document.createElement("select");
  select.id = boxContext.id;
  select.className = "combo-box";

  boxContext.optionTypes.forEach(optionType => {
    const option = document.createElement("option");
    option.value = optionType.value;
    option.textContent = optionType.label;
    select.appendChild(option);
  });

  select.onchange = async () => {
    const selectedOption = select.options[select.selectedIndex].value;
    const list = await context["CUSTOMERINFORMATION_LIST"].listFetch(selectedOption);
    sessionStorage.setItem("list", JSON.stringify(list));
    setTableBody();
  };

  return select;
};


const setPostButton = () => {
  const button = document.createElement("button");
  button.id = "postButton";
  button.textContent = BUTTON.COMMON.POST;
  button.addEventListener("click", () => {
    alert("등록 버튼 클릭!");
  });
  return button;
};

const setSearchBar = () => {
  const container = document.querySelector(".search-container");
  const comboBox = setComboBox();
  if (comboBox) {
    container.appendChild(comboBox);
  } else {
    container.appendChild(setPostButton());
  }

  container.appendChild(setInput());

  const button = document.createElement("button");
  button.id = "searchButton";
  button.textContent = BUTTON.COMMON.SEARCH;
  container.appendChild(button);
};

const setColumn = () => {
  const columnList = COLUMN_NAME["CUSTOMERINFORMATION_LIST"];
  const head = document.getElementById("tableHead");
  const columns = document.createElement("tr");

  columnList.forEach(item => {
    const column = document.createElement("th");
    column.innerHTML = item;
    columns.appendChild(column);
  })
  head.appendChild(columns);
}

const setTableBody = () => {
  const tableBody = document.getElementById("list");
  tableBody.innerHTML= "";

  const data = JSON.parse(sessionStorage.getItem("list")) || [];
  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = context["CUSTOMERINFORMATION_LIST"].rowGetter(item);

    row.addEventListener("click", () => {
      if (window.selectedRow) {
        window.selectedRow.classList.remove("selected");
      }
      row.classList.add("selected");
      window.selectedRow = row;
    });

    row.addEventListener("dblclick", () => {
      sessionStorage.setItem("selectedCustomerInformation", JSON.stringify(item)); // 선택된 데이터 저장
      window.location.href = "detail.html"; // 상세 페이지로 이동
    });

    tableBody.appendChild(row);
  });
};

const initialTable = () => {
  setTitle();
  setSearchBar();
  setColumn();
  setTableBody();
};


