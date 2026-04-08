"use client";
import { useState } from "react";
import { departamentosParaguay } from "@/data/staticData";
import { formatPrice as fp } from "@/utils/formatePrice";

export default function ShippingCalculator() {
  const [selectedDept, setSelectedDept] = useState("");
  const [showResult, setShowResult] = useState(false);

  const dept = departamentosParaguay.find((d) => d.nombre === selectedDept);

  const handleCalculate = () => {
    if (selectedDept) setShowResult(true);
  };

  return (
    <div className="mt-6 p-4 bg-gray-1 rounded-xl border border-gray-3">
      <h3 className="text-base font-semibold text-dark mb-3 flex items-center gap-2">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Cotizar flete
      </h3>
      <p className="text-xs text-dark-4 mb-3">
        Seleccioná el departamento de destino para ver el costo estimado de traslado.
      </p>

      <div className="flex gap-2">
        <select
          value={selectedDept}
          onChange={(e) => { setSelectedDept(e.target.value); setShowResult(false); }}
          className="flex-1 border border-gray-3 rounded-lg px-3 py-2 text-sm text-dark bg-white focus:outline-none focus:border-blue"
        >
          <option value="">-- Seleccioná un departamento --</option>
          {departamentosParaguay.map((d) => (
            <option key={d.nombre} value={d.nombre}>
              {d.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={handleCalculate}
          disabled={!selectedDept}
          className="px-4 py-2 bg-dark text-white text-sm font-semibold rounded-lg hover:bg-dark-2 ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calcular
        </button>
      </div>

      {showResult && dept && (
        <div className="mt-3 p-3 bg-blue rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-dark">
            Costo estimado a <strong>{dept.nombre}</strong>:
          </span>
          <span className="text-base font-bold text-dark">
            {fp(dept.costoFlete)}
          </span>
        </div>
      )}

      {showResult && dept && (
        <p className="text-xs text-dark-4 mt-2">
          * Costo aproximado. El precio final puede variar según dimensiones y peso del equipo.
          Consultá por WhatsApp para confirmar.
        </p>
      )}
    </div>
  );
}
