/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { useState, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import { SPACETYPESMAP } from "../../utils";

const spaceTypesOpts = Object.keys(SPACETYPESMAP).map((k) => {
  return { value: k, label: SPACETYPESMAP[k] };
});

const Float1DigitsFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{Number(cell).toFixed(1)}</span>
);
const Float2DigitsFmt = (cell, _row, _rowIndex, _formatExtraData) => {
  if (cell === null || cell === undefined) {
    return <span>-</span>;
  } else {
    return <span>{Number(cell).toFixed(2)}</span>;
  }
};
const BoolFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{cell === true ? "Sí" : "No"}</span>
);
const SpaceTypeFmt = (cell, _row, _rowIndex, _formatExtraData) => (
  <span>{SPACETYPESMAP[cell]}</span>
);

// Custom editor para booleanos
//
// The getElement function returns a JSX value and takes two arguments:
//  - onUpdate: if you want to apply the modified data, call this function
//  - props: contain customEditorParameters, whole row data, defaultValue and attrs
// Usamos forwardRef para poder tener referencias en componentes funcionales
// ver: https://github.com/reactjs/reactjs.org/issues/2120
const BoolEditor = React.forwardRef((props, ref) => {
  const { value: defaultValue, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      type="checkbox"
      checked={value}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onUpdate(value);
        }
      }}
      onChange={(e) => setValue(!value)}
      onBlur={(e) => onUpdate(value)}
    />
  );
});

// Custom editor para nivel de ventilación de los espacios n_v
const NVEditor = React.forwardRef((props, ref) => {
  const { defaultValue, onUpdate } = props;
  const [value, setValue] = useState(defaultValue);
  const updateData = () => {
    // onUpdate cancela la edición si se pasa null así que usamos undefined en ese caso
    // en BootstrapTable usamos cellEdit.afterSaveCell para cambiar undefined por null
    const res =
      value === null || value === ""
        ? undefined
        : Number(value.replace(",", "."));
    onUpdate(res);
  };

  return (
    <span>
      <input
        type="text"
        value={value === null || undefined ? "" : value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateData();
          }
        }}
        onChange={(e) => {
          let val = e.currentTarget.value;
          val =
            val === "" ||
            val === null ||
            Number.isNaN(Number(val.replace(",", ".")))
              ? ""
              : val;
          setValue(val);
        }}
        onBlur={(e) => updateData()}
      />
    </span>
  );
});

// Tabla de espacios del edificio
const SpacesTable = ({ selected, setSelected }) => {
  const appstate = useContext(AppState);
  const columns = [
    { dataField: "id", isKey: true, hidden: true },
    {
      dataField: "name",
      text: "Nombre",
      width: "30%",
      headerTitle: () => "Nombre del espacio",
      headerClasses: "text-light bg-secondary",
      title: (_cell, row) => `Espacio id: ${row.id}`,
    },
    {
      dataField: "area",
      text: "A",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () => "Superficie útil del espacio (m²)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          A<br />
          <span style={{ fontWeight: "normal" }}>
            <i>
              [m<sup>2</sup>]
            </i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "multiplier",
      text: "Multiplicador",
      align: "center",
      formatter: Float1DigitsFmt,
      headerTitle: () => "Multiplicador (-)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          mult.
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "type",
      text: "Tipo",
      align: "center",
      formatter: SpaceTypeFmt,
      editor: {
        type: Type.SELECT,
        options: spaceTypesOpts,
      },
      headerTitle: () =>
        "Tipo de espacio: ACONDICIONADO, NO ACONDICIONADO, NO HABITABLE",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          Tipo
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[-]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "inside_tenv",
      text: "Interior a ET",
      align: "center",
      formatter: BoolFmt,
      editorRenderer: (
        editorProps,
        value,
        _row,
        _column,
        _rowIndex,
        _columnIndex
      ) => <BoolEditor value={value} {...editorProps} />,
      headerTitle: () => "¿Pertenece a la envolvente térmica?",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          ¿Interior <br />a la E.T.?
        </>
      ),
    },
    {
      dataField: "height",
      text: "Altura",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () =>
        "Altura total, bruta, o suelo a suelo, del espacio (m)",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          h<sub>s-s</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "n_v",
      text: "Ventilación ren/h",
      align: "center",
      formatter: Float2DigitsFmt,
      customEditor: {
        getElement: (onUpdate, props) => (
          <NVEditor onUpdate={onUpdate} defaultValue={null} {...props} />
        ),
      },
      headerTitle: () =>
        "Ventilación, en ren/h. Sólo para espacios no habitables.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          n<sub>v</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[ren/h]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "z",
      text: "z",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () => "Cota de la planta, en m",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          z
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
    {
      dataField: "exposed_perimeter",
      text: "Perímetro expuesto",
      align: "center",
      formatter: Float2DigitsFmt,
      headerTitle: () =>
        "Perímetro del espacio expuesto al exterior, en m. Excluye la que lo separa de otros espacios acondicionados. Es relevante en el caso de espacios en contacto con el terreno.",
      headerClasses: "text-light bg-secondary",
      headerAlign: "center",
      headerFormatter: () => (
        <>
          p<sub>ext</sub>
          <br />
          <span style={{ fontWeight: "normal" }}>
            <i>[m]</i>{" "}
          </span>
        </>
      ),
    },
  ];

  return (
    <BootstrapTable
      data={appstate.spaces}
      keyField="id"
      striped
      hover
      bordered={false}
      cellEdit={cellEditFactory({
        mode: "dbclick",
        blurToSave: true,
        afterSaveCell: (oldValue, newValue, row, column) => {
          if (
            (column.dataField === "n_v" && newValue === undefined) ||
            (column.dataField === "type" && newValue !== "UNINHABITED")
          ) {
            // Corrige el valor de n_v de undefined a null
            // o cambia a null cuando no son espacios no habitables
            row.n_v = null;
          } else if (
            !["name", "inside_tenv", "type"].includes(column.dataField)
          ) {
            // Convierte a número salvo en el caso del nombre o de inside_tenv
            const value = parseFloat(newValue.replace(",", "."));
            row[column.dataField] = isNaN(value) ? oldValue : value;
          }
        },
      })}
      selectRow={{
        mode: "checkbox",
        clickToSelect: true,
        clickToEdit: true,
        selected: selected,
        onSelect: (row, isSelected) => {
          if (isSelected) {
            setSelected([...selected, row.id]);
          } else {
            setSelected(selected.filter((it) => it !== row.id));
          }
        },
        hideSelectColumn: true,
        bgColor: "lightgray",
      }}
      rowClasses={(row, _rowIndex) => {
        // clase para elementos fuera de la ET
        return row.inside_tenv ? null : "outsidetenv";
      }}
      columns={columns}
    />
  );
};

export default observer(SpacesTable);
// export default observer(()=> <p>Prueba</p>)
