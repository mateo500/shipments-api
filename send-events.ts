import { messages } from "./messages";
import axios from "axios";

async function main() {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    let endpoint = "shipment";
    if (message.type === "ORGANIZATION") {
      endpoint = "organization";
    }

    try {
      console.log(
        (await axios.post(`http://localhost:3000/${endpoint}`, message)).status
      );
    } catch (error) {
      console.error(error.code);
    }
  }
}

main();
