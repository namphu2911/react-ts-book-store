import { useCurrentApp } from "components/context/app.context";

const AppHeader = () => {
    const { user } = useCurrentApp();
    return (
        <>
            Header co user: {JSON.stringify(user)}
        </>
    )
}
export default AppHeader;