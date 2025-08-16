import MessageContent from "../components/MessageContent";
import Header from "../components/Header.jsx";
import ResponsiveHeader from "../components/ResponsiveHeader.jsx";
function MessagePage(){
    return(<>
        <Header />
        <ResponsiveHeader/>
        <MessageContent />
    </>);
}

export default MessagePage;