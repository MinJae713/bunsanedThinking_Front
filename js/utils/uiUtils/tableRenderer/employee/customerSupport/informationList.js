import {
  fetchGetAccident,
  fetchGetAllAccident,
  fetchGetAllComplaint,
  fetchGetAllCompletedAccident,
  fetchGetAllProcessedComplaint, fetchGetAllUnprocessedAccident,
  fetchGetAllUnprocessedComplaint,
  fetchGetComplaint,
  fetchGetAllProcessingAccident
} from "../../../../apiUtils/apiDocumentation/employee/customerSupport/customerSupport.js"
import {
  BUTTON,
  CLASS, CLASS_SELECTOR,
  ELEMENT_ID as COMMON_ELEMENT_ID,
  EVENT,
  INPUT_TYPE,
  KEY,
  LOCATION,
  MESSAGES,
  TAG
} from "../../../../../../config/common.js";
import {
  COLUMN_NAME,
  COMBO_LIST,
  COMBOBOX,
  INFORMATION_TYPE,
  ELEMENT_ID
} from "../../../../../../config/employee/customerSupport/customerSupport.js";
import {TITLE} from "../../../../../../config/employee/customerSupport/customerSupport.js";

export const informationType = {
  HANDLE_REPORT: INFORMATION_TYPE.HANDLE_REPORT,
  HANDLE_COMPLAINT: INFORMATION_TYPE.HANDLE_COMPLAINT
}

const rowLabel = {
  HANDLE_COMPLAINT: [
    ELEMENT_ID.COMPLAINT_TYPE,
    ELEMENT_ID.ID,
    ELEMENT_ID.TITLE,
    ELEMENT_ID.POST_DATE,
    ELEMENT_ID.EMPLOYEE_NAME,
    ELEMENT_ID.PROCESSING_DATE,
    ELEMENT_ID.PROCESS_STATUS,
    ELEMENT_ID.CUSTOMER_NAME,
    ELEMENT_ID.CUSTOMER_PHONE_NUMBER
  ],
  HANDLE_REPORT: [
    ELEMENT_ID.ID,
    ELEMENT_ID.SERVICE_TYPE,
    ELEMENT_ID.DATE,
    ELEMENT_ID.LOCATION,
    ELEMENT_ID.CUSTOMER_NAME,
    ELEMENT_ID.CUSTOMER_PHONE_NUMBER,
    ELEMENT_ID.PROCESS_STATUS
  ]
}

const rows = (dto, labels) => {
  const items = [];
  labels.forEach(label => {
    const td = document.createElement(TAG.TD);
    td.textContent = dto[label];
    items.push(td);
  });
  return items;
}

const getAccidentId = (data) => {
  return data.id;
}

const getComplaintId = (data) => {
  return data.id;
}

const context = {
  HANDLE_REPORT: {
    title: TITLE.HANDLE_REPORT,
    listFetch: fetchGetAllAccident,
    listFetchById: fetchGetAccident,
    comboListFetch: {
      all: fetchGetAllAccident,
      completed: fetchGetAllCompletedAccident,
      unprocessed: fetchGetAllUnprocessedAccident,
      processing: fetchGetAllProcessingAccident
    },
    idGetter: getAccidentId,
    columnList: [
      COLUMN_NAME.HANDLE_REPORT.ACCIDENT_ID,
      COLUMN_NAME.HANDLE_REPORT.SERVICE_TYPE,
      COLUMN_NAME.HANDLE_REPORT.ACCIDENT_DATE,
      COLUMN_NAME.HANDLE_REPORT.ACCIDENT_LOCATION,
      COLUMN_NAME.HANDLE_REPORT.CUSTOMER_NAME,
      COLUMN_NAME.HANDLE_REPORT.CUSTOMER_PHONE_NUMBER,
      COLUMN_NAME.HANDLE_REPORT.PROCESS_STATUS
    ]
  },
  HANDLE_COMPLAINT: {
    title: TITLE.HANDLE_COMPLAINT,
    listFetch: fetchGetAllComplaint,
    listFetchById: fetchGetComplaint,
    comboListFetch: {
      all: fetchGetAllComplaint,
      completed: fetchGetAllProcessedComplaint,
      unprocessed: fetchGetAllUnprocessedComplaint
    },
    idGetter: getComplaintId,
    columnList: [
      COLUMN_NAME.HANDLE_COMPLAINT.COMPLAINT_TYPE,
      COLUMN_NAME.HANDLE_COMPLAINT.COMPLAINT_ID,
      COLUMN_NAME.HANDLE_COMPLAINT.COMPLAINT_TITLE,
      COLUMN_NAME.HANDLE_COMPLAINT.COMPLAINT_DATE,
      COLUMN_NAME.HANDLE_COMPLAINT.EMPLOYEE_NAME,
      COLUMN_NAME.HANDLE_COMPLAINT.PROCESSING_DATE,
      COLUMN_NAME.HANDLE_COMPLAINT.PROCESS_STATUS,
      COLUMN_NAME.HANDLE_COMPLAINT.CUSTOMER_NAME,
      COLUMN_NAME.HANDLE_COMPLAINT.CUSTOMER_PHONE_NUMBER
    ]
  }
}

export const viewInformationListAll = async (fetchType) => {
  sessionStorage.setItem(KEY.CURRENT_TYPE, fetchType);
  const list = await context[fetchType].listFetch();
  sessionStorage.setItem(KEY.LIST, JSON.stringify(list));
  window.location.href = LOCATION.INFORMATION;
}

export const renderTable = () => {
  initialTable();
}

const initialTable = () => {
  setTitle();
  setSearchBar();
  setColumn();
  setTableBody();
}

const setTitle = () => {
  const currentContext = context[sessionStorage.getItem(KEY.CURRENT_TYPE)];
  const contextTitle = document.getElementById(COMMON_ELEMENT_ID.TITLE);
  contextTitle.innerText = currentContext.title;
}

const setColumn = () => {
  const currentContext = context[sessionStorage.getItem(KEY.CURRENT_TYPE)];
  const head = document.getElementById(COMMON_ELEMENT_ID.TABLE_HEAD);
  const columns = document.createElement(TAG.TR);
  currentContext.columnList.forEach(item => {
    const oneColumn = document.createElement(TAG.TH);
    oneColumn.innerHTML = item;
    columns.appendChild(oneColumn);
  })
  head.appendChild(columns);
}

const setComboBox = () => {
  const select = document.createElement(TAG.SELECT);
  const type = sessionStorage.getItem(KEY.CURRENT_TYPE);
  const boxContext = COMBOBOX[type];
  console.log(JSON.stringify(boxContext));
  if (!boxContext.isCombo) return null;
  select.id = boxContext.id;
  select.className = CLASS.COMBO_BOX;
  const optionTypes = boxContext.optionTypes;
  optionTypes.forEach(optionType => {
    const option = document.createElement(TAG.OPTION);
    option.value = optionType.value;
    option.textContent = optionType.label;
    select.appendChild(option);
  });
  return select;
}

const setInput = () => {
  const input = document.createElement(TAG.INPUT);
  input.type = INPUT_TYPE.TEXT;
  input.id = COMMON_ELEMENT_ID.SEARCH_INPUT;
  input.placeholder = MESSAGES.PLACE_HOLDER.SEARCH;
  return input;
}

const initTableByInput = async (id, type) => { // 추가
  const tableBody = document.getElementById(KEY.LIST);
  while (tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);
  if (id.length > 0) {
    const item = await context[type].listFetchById(id);
    setOneRow(item, type);
  } else {
    const list = await context[type].comboListFetch[COMBO_LIST.ALL]();
    if (list != null) sessionStorage.setItem(KEY.LIST, JSON.stringify(list));
    setTableBody();
  }
}

const setOneRow = (item, type) => {
  const tableBody = document.getElementById(KEY.LIST);
  const row = document.createElement(TAG.TR);
  let id = context[type].idGetter(item);
  rows(item, rowLabel[type]).forEach(rowItem => row.appendChild(rowItem));
  // 각 행에 클릭 이벤트 추가
  row.addEventListener(EVENT.CLICK, () => {
    if (window.selectedRow) {
      window.selectedRow.classList.remove(CLASS.SELECTED);
    }
    row.classList.add(CLASS.SELECTED);
    window.selectedRow = row;
  });

  // 더블 클릭 시 상세 페이지로 이동
  row.addEventListener(EVENT.DOUBLE_CLICK, () => {
    // 상세 정보를 세션에 저장
    sessionStorage.setItem(KEY.SELECTED_DATA_ID, JSON.stringify(id));
    window.location.href = LOCATION.DETAIL;
  });

  tableBody.appendChild(row);
}

const setButton = () => {
  const button = document.createElement(TAG.BUTTON);
  button.id = COMMON_ELEMENT_ID.SEARCH_BUTTON;
  button.textContent = BUTTON.COMMON.SEARCH;
  const type = sessionStorage.getItem(KEY.CURRENT_TYPE);
  button.addEventListener(EVENT.CLICK, () => {
    const value = document.getElementById(COMMON_ELEMENT_ID.SEARCH_INPUT).value;
    initTableByInput(value, type);
  })
  return button;
}

const initTableBySelect = async (id, type) => { // 추가
  const select = document.getElementById(id);
  const selectedOption = select.options[select.selectedIndex];
  const list = await context[type].comboListFetch[selectedOption.value]();
  if (list != null) sessionStorage.setItem(KEY.LIST, JSON.stringify(list));
  const tableBody = document.getElementById(KEY.LIST);
  while (tableBody.firstChild) tableBody.removeChild(tableBody.firstChild);
  setTableBody();
}

const setSearchBar = () => {
  const container = document.querySelector(CLASS_SELECTOR.SEARCH_CONTAINER);
  const type = sessionStorage.getItem(KEY.CURRENT_TYPE);
  const select = COMBOBOX[type].isCombo ? setComboBox() : null;
  if (select != null) { // 추가
    container.appendChild(select);
    select.onchange = () => initTableBySelect(select.id, type); // 추가
  }
  container.appendChild(setInput());
  container.appendChild(setButton());
}

const setTableBody = () => {
  const type = sessionStorage.getItem(KEY.CURRENT_TYPE);
  const data = JSON.parse(sessionStorage.getItem(KEY.LIST));
  data.forEach(item => {
    setOneRow(item, type);
  });
}
