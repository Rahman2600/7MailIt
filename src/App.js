import Table from './Table.js';


function App() {
  let data = [
    { title: "Template Key",
     content: ["3fda23114tdf5",
              "4s395ter203d4"]
    },

    { title: "Template Name",
      content: ["Offer Notice", "Change of Term"]},
    
    { title: "Upload Date",
      content: ["01/07/2019", "02/09/2017"]},

    { title: "Team",
      content: ["Marketing", "Investment"]},

    { title: "Dynamic Values",
      content: ["NAME AMOUNT", "NAME"]}

  ]

  return (
    <div>
      <Table data={data}/>
    </div>
  );
}

export default App;
