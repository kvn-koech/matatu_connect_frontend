import Navbar from "./Navbar";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar role={null} />
      <main>{children}</main>
    </>
  );
};

export default PublicLayout;
