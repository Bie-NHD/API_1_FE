import axios from "axios";

import { testApartmentsOnly, testContractsOnly } from "./test";

import {
  TEST_URL,
  API_ROUTE_APARMENT,
  API_ROUTE_CONTRACT,
} from "../utils/constants";

//
//  REQUEST ACTION ROUTES
//

const ADD = "/add";
const DELETE = "/delete/";
const IMPORT = "/import";
const SEARCH = "/search";
const UPDATE = "/update/"
const FORM_HEADER = {
  "Content-Type": "multipart/form-data",
};

export const baseURL = axios.create({ baseURL: TEST_URL });

//
//  BASE REQUEST TEMPLATES
//

const baseRequestAddAPI = async (route, data) =>
  baseURL.post(route + ADD, data).then((response) => response.data);

const baseRequestDeleteAPI = async (route, id) =>
  baseURL
    .delete(route + DELETE + id)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
    });

const baseRequestSearchAPI = async (route, query, page = 0, pageSize = 10) =>
  baseURL.get(route + SEARCH, {
    params: {
      q: query,
      page: page,
      pageSize: pageSize,
    },
  });

const baseRequestImportFileAPI = async (route, formData) =>
  baseURL
    .post(route + IMPORT, formData, { headers: FORM_HEADER })
    .then((response) => {
      console.log("FINISH REQUEST");
      console.log(response);
      return response;
    })
    .catch((error) => console.log(error));

export const exportFileAPI = (route, getTemplate = false) => {
  return TEST_URL + route + "/export?getTemplate=" + getTemplate;
};

//
// APARTMENT REQUESTS
//

export const fetchApartmentsAPI = async (page, pageSize) =>
  baseURL
    .get(API_ROUTE_APARMENT, {
      params: {
        page: page,
        pageSize: pageSize,
      },
    })
    .then((response) => {
      console.log(response.data.data);
      return response.data.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

export const importApartmentsAPI = async (formData) =>
  baseRequestImportFileAPI(API_ROUTE_APARMENT, formData);

export const addAparmentAPI = async (apartmentDTO) =>
  baseRequestAddAPI(API_ROUTE_APARMENT, apartmentDTO);

  export const updateApartmentAPI = async (apartmentDTO, id) => baseURL.post(API_ROUTE_APARMENT+UPDATE+id,apartmentDTO)

export const deleteApartmentAPI = async (id) =>
  baseRequestDeleteAPI(API_ROUTE_APARMENT, id);

//
// APARTMENT REQUESTS
//

export const deleteContractAPI = async (id) =>
  baseRequestDeleteAPI(API_ROUTE_CONTRACT, id);

export const fetchTestApartment = testApartmentsOnly;
export const fetchTestContract = testContractsOnly;
