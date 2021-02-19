import Table from './Table.js';
import HomePageRight from "./HomePageRight";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CampaignPage from "./CampaignPage";

function App() {
  let table = {
    numRows: 2, columns: [
      {
        title: "Template Key",
        content: ["3fda23114tdf5",
          "4s395ter203d4"]
      },

      {
        title: "Template Name",
        content: ["Offer Notice", "Change of Term"]
      },

      {
        title: "Upload Date",
        content: ["01/07/2019", "02/09/2017"]
      },

      {
        title: "Team",
        content: ["Marketing", "Investment"]
      },

      {
        title: "No. of Campaigns",
        content: ["3", "0"]
      },

      {
        title: "Status",
        content: [{ button: "Ready" }, "Upload"]
      },

      {
        title: "Dynamic Values",
        content: ["NAME AMOUNT", "NAME"]
      },

      {
        title: "Details",
        content: [{ button: "View" }, { button: "View" }]
      }



    ]
  }

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Table data={table} />
            <HomePageRight />
          </Route>
          <Route path="/campaignPage/:templateKey" component={CampaignPage}>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
