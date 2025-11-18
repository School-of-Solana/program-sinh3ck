import { createCodamaConfig } from "gill";
 
export default createCodamaConfig({
  idl: "target/idl/solchat.json",
  clientJs: "clients/js/src/generated",
});