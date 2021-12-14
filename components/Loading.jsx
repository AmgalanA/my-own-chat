import { Circle } from 'better-react-spinkit';

const Loading = () => {
    return (
        <center style={{ display: "grid", placeItems: 'center', height: '100vh' }}>
            <div>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Google_Chat_icon_%282020%29.svg/982px-Google_Chat_icon_%282020%29.svg.png"
                    alt=""
                    style={{ marginBottom: 10}}
                    height={200}
                />

                <Circle
                    color="#3CBC28" 
                    size={60}
                />
            </div>
        </center>
    )
}

export default Loading
