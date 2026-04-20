const FooterBottom = () => {
  const year = new Date().getFullYear();

  return (
    <div className="py-5 xl:py-7.5 bg-dark">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="text-sm font-normal text-white">
            &copy; {year} HC COMERCIAL. Todos los derechos reservados.
          </p>

          <p className="font-normal text-white text-sm">
            Desarrollado por <span className="text-blue font-semibold">mescobar</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
