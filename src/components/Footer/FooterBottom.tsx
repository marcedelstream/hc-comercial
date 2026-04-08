const FooterBottom = () => {
  const year = new Date().getFullYear();

  return (
    <div className="py-5 xl:py-7.5 bg-dark">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="text-sm font-normal text-white">
            &copy; {year} HC COMERCIAL. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <p className="font-normal text-white text-sm">Pago seguro con:</p>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md">
              <span className="font-bold text-sm text-dark">BANCARD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
