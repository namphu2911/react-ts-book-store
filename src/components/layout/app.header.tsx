import { useCurrentApp } from "components/context/app.context";

const AppHeader = () => {
    const { user } = useCurrentApp();
    return (
        <>
            {JSON.stringify(user)}
        </>
    )
}
export default AppHeader;