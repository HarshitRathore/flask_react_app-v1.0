function App() {
    return <div>
        <TopBar />
        <Content />
    </div>;
}
function TopBar() {
    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Form</a>
    </nav>;
}
class Content extends React.Component {
    // componentDidMount() {
    //     console.log(new sql.Database());
    // }
    constructor(props) {
        super(props);
        this.state = {
            data: 0,
            input_1: 0,
            input_2: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSQLitePublish = this.handleSQLitePublish.bind(this);
        this.handleMongoDBPublish = this.handleMongoDBPublish.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleSubmit(event) {
        var sum = parseInt(this.state.input_1) + parseInt(this.state.input_2)
        this.setState({
            data: sum
        });
        event.preventDefault();
    }
    handleClear() {
        this.setState({
            data: 0,
            input_1: 0,
            input_2: 0
        });
    }
    handleSQLitePublish() {
        console.log("Publishing in SQLite DB");
        $.ajax({
            url: "/publishSQLiteDB",
            type: "get",
            data: {
                input1: parseInt(this.state.input_1),
                input2: parseInt(this.state.input_2),
                sum: parseInt(this.state.data)
            },
            success: function (response) {
                console.log(response.packet);
                $('#insertion-result').text(response.packet);
                $('#resultModal').modal('show');
                setTimeout(function() {
                    $("#resultModal").modal('hide');
                  }, 5000);
            },
            error: function (xhr) {
                console.log(response);
                $('#insertion-result').text(response);
                $('#resultModal').modal('show');
                setTimeout(function() {
                    $("#resultModal").modal('hide');
                  }, 5000);
            }
        });
    }
    handleMongoDBPublish() {
        console.log("Publishing in MongoDB");
        $.ajax({
            url: "/publishMongoDB",
            type: "get",
            data: {
                input1: parseInt(this.state.input_1),
                input2: parseInt(this.state.input_2),
                sum: parseInt(this.state.data)
            },
            success: function (response) {
                console.log(response);
                $('#insertion-result').text(response);
                $('#resultModal').modal('show');
                setTimeout(function() {
                    $("#resultModal").modal('hide');
                  }, 1500);
            },
            error: function (xhr) {
                console.log(response.packet);
                $('#insertion-result').text(response.packet);
                $('#resultModal').modal('show');
                setTimeout(function() {
                    $("#resultModal").modal('hide');
                  }, 1500);
            }
        });
    }
    render() {
        return (
            <div>
                <div className="container mt-5">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Input 1</span>
                                    </div>
                                    <input type="text" name="input_1" value={this.state.input_1} className="form-control" placeholder="Input 1" aria-label="Input 1" aria-describedby="basic-addon1" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">Input 2</span>
                                    </div>
                                    <input type="text" name="input_2" value={this.state.input_2} className="form-control" placeholder="Input 2" aria-label="Input 2" aria-describedby="basic-addon1" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-5"></div>
                            <div className="col-sm-2">
                                <div className="btn-group" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-danger" onClick={this.handleClear}>Clear</button>
                                    <button type="submit" className="btn btn-success">Process</button>
                                </div>
                            </div>
                            <div className="col-sm-5"></div>
                        </div>
                    </form>
                </div>
                <footer className="fixed-bottom bg-black fixed-height-40">
                    <div className="row">
                        <div className="col-sm-8">
                            <div className="row">
                                <div className="terminal-heading col-sm-12">
                                    <h3>Output</h3>
                                </div>
                                <div className="terminal-output col-sm-12">
                                    &#123;
                                          <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;{this.state.data}
                                    <br />
                                    &#125;
                                      </div>
                            </div>
                        </div>
                        <div className="col-sm-4 center-align">
                            <div className="row backg-yellow">
                                <h3>Publish</h3>
                            </div>
                            <div className="row mt-4">
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4">
                                    <div className="btn-group-vertical" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-info btn-lg" onClick={this.handleSQLitePublish} >SQLite</button>
                                        <button type="button" className="btn btn-success btn-lg" onClick={this.handleMongoDBPublish} >MongoDB</button>
                                    </div>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>
                        </div>
                    </div>
                </footer>
                <div className="modal fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="resultModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Result</h5>
                            </div>
                            <div className="modal-body" id="insertion-result">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));