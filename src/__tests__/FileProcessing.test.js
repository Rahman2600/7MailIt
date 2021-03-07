import '@testing-library/jest-dom/extend-expect'

import { convertToTemplate, uploadFile } from "../aws_util"


it("upload file test", () => {
  return expect(uploadFile("testDock", "./BasicTemplate_withDynamicVals.docx", 'docxtemplates')).resolves.not.toThrow();
});

it("convert to template test", () => {
  return expect(convertToTemplate("testDock", "docxtemplates")).resolves.not.toThrow();
});