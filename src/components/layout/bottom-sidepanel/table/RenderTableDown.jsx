import React, { useState } from 'react'
import { useLocalState } from '../../../../context/CleanLocalState';
import { formatHeader } from '../helper/formatHeader';

export const RenderTableDown = ({dataTable, columnHeaders}) => {
   const { currentPage, itemsPerPage } = useLocalState();
   const [copied, setCopied] = useState(null);

    if (!dataTable || dataTable.length === 0) {
        return <div className='text-center mt-2'>No hay datos para mostrar.</div>;
    }
    
    const startPage = (currentPage - 1) * itemsPerPage;
    const visibleData = dataTable.slice(startPage, startPage + itemsPerPage);

    const filteredColumnHeaders = columnHeaders?.filter(
        (header) => header !== 'objectid' && header !== 'geom'
    ) || [];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

  return (
    <div className="overflow-x-auto overflow-y-auto custom-scrollbar">
      <table className="min-w-full border-collapse ">
        <thead className="bg-gray-100 border-b-2 border-gray-300 sticky top-0">
          <tr>
            {filteredColumnHeaders.map((header) => (
              <th
                key={header}
                className="px-1 py-2 text-left min-w-[200px] text-[10px] font-medium text-gray-600 uppercase tracking-wider border-r border-gray-300"
              >
                {formatHeader(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-start w-full">
          {visibleData.length === 0 ? (
            <tr>
              <td colSpan={filteredColumnHeaders.length} className="px-4 py-2 text-[11px] text-gray-800 border-r border-gray-300">
                No hay datos que coincidan con el filtro.
              </td>
            </tr>
          ) : (
            visibleData.map((item, index) => (
              <tr key={item?.id || index} className="border-b border-gray-300">
                {filteredColumnHeaders.map((key) => (
                  <td
                    key={`${index}-${key}`}
                    className={`px-1 py-1 text-[9px] text-gray-800 border-gray-300 ${key === 'id' ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                    title={key === 'id' ? `Copiar: ${item.properties?.[key]}` : ''}
                    onClick={key === 'id' ? () => handleCopy(item.properties?.[key]) : undefined}
                  >
                    {key === 'id' 
                    ? (copied === item.properties?.[key] ? '✓ Copiado' : '...') 
                    : item.properties?.[key] === 'true' || item.properties?.[key] === true
                    ? 'Si' 
                    : item.properties?.[key] === 'false' || item.properties?.[key] === false
                    ? 'No' 
                    : key === 'longitud' || key === 'latitud'
                    ? item.properties?.[key]?.toFixed(6)
                    : item.properties?.[key] || '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
