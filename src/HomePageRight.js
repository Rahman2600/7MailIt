import React from "react";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: '' }
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    render() {
        return (
             <div className="right-component">
                <button className="btn btn-light mt-5 ml-5 mr-5 mb-5 float-right"> Log out </button>
                <button className="btn btn-light btn-block mt-5"> View Job Logs </button>
                <form>
                    <div className="form-group">
                        <input type="file" className="form-control-file" id="file" onChange={this.onFileChange}/>
                    </div>
                </form>
                <button className="btn btn-light btn-block mt-5" onClick={this.onFileUpload}> Upload New Template </button>
            </div> 
        )
    }

    onFileChange(event) {
        this.setState({ selectedFile: event.target.files[0] });
    }

    onFileUpload() {
        console.log(this.state.selectedFile);
        var allowedExtensions = /(\.doc|\.docx)$/i;
        var fileInput = this.state.selectedFile;
        var filePath = fileInput.name;
        console.log(filePath);
        if(!allowedExtensions.exec(filePath)){
            alert('Please upload file having extensions .doc or docx only.');
            fileInput.value = '';
            return false;
        }

    }
}

export default HomePageRight;