import React from 'react'
/**
 * Renders a list of HTML input elements of type checkbox
 * @param {Array}  props.list - list of {value: <string>, checked: <boolean>}
 * @param {Function} props.onChange 
 }}
 */
class CheckList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkStates: this.props.list};

        this.onChange = this.onChange.bind(this);
    }
    
    render() {
        //console.log(this.state);
        return (
            <ul className="list-group">
                {this.state.checkStates.map((element) => {
                    return (
                        <div className="form-check" key={element.value + "l"}>
                                <input 
                                    className="form-check-input"
                                    type="checkbox" 
                                    id={element.value}
                                    key={element.value + "i"} 
                                    checked={element.checked}
                                    onChange={() => this.onChange(element.value)}
                                />
                                <label className="form-check-label" htmlFor={element.value}> {element.value} </label>
                        </div>
                    );
                })}
            </ul>
        )
    }

    onChange(value) {
        let checkStatesCopy = this.state.checkStates.slice();
        for (let checkState of checkStatesCopy) {
            if (value === checkState.value) {
                checkState.checked = !checkState.checked
            }
        }
        this.setState({checkStates: checkStatesCopy});
        this.props.onChange(checkStatesCopy);
    }
}

export default CheckList;