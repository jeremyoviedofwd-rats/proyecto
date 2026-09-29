export default function Table({ columns, data, rowKey = "id", emptyText = "Sin registros" }) {
    if (!data?.length) {
        return <p className="text-sm text-on-surface-variant py-8 text-center font-medium">{emptyText}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/30">
                        {columns.map((col) => (
                            <th key={col.key} className="pb-3 font-semibold px-3">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {data.map((row) => (
                        <tr key={row[rowKey]} className="hover:bg-surface-container/40 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="py-3 px-3">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}