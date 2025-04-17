import './App.css';

function App() {
    const year = new Date().getFullYear();

    return (
        <div className="App">
            <div className="title">
                <h1>ClassTrack</h1>
            </div>
            <div className="main">

            </div>
            <div className="footer">
            <p>&copy; {year} ClassTrack. All rights reserved.</p>
            </div>
        </div>
    );
}

export default App;
