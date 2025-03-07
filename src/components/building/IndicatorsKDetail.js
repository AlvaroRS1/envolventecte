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

import React, { useContext } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";

import AppState from "../../stores/AppState";
import KElementsChart from "./IndicatorsKChart";
import { round_or_dash } from "../../utils";

const formatted = (elem, bold = false) => (bold ? <b>{elem}</b> : <>{elem}</>);

const IndicatorsKDetail = ({ isShown }) => {
  const appstate = useContext(AppState);
  const {
    K,
    summary,
    roofs,
    floors,
    walls,
    windows,
    ground,
    tbs,
  } = appstate.he1_indicators.K_data;
  const {
    a,
    au,
    opaques_a,
    opaques_au,
    windows_a,
    windows_au,
    tbs_l,
    tbs_psil,
  } = summary;

  // Elementos detallados: título, a, au, tipo, ¿con formato especial?
  const all_elements = [
    ["Huecos", "Huecos", windows.a, windows.au, "Tipo", true, "#0096e1"],
    ["Opacos", "Opacos", opaques_a, opaques_au, "Tipo", true, "#a0401a"],
    [
      "- Fachadas (O-W)",
      "O-W",
      walls.a,
      walls.au,
      "TipoOpaco",
      false,
      "#eedaa3",
    ],
    [
      "- Cubiertas (O-R)",
      "O-R",
      roofs.a,
      roofs.au,
      "TipoOpaco",
      false,
      "#c28586",
    ],
    [
      "- Suelos (O-F)",
      "O-F",
      floors.a,
      floors.au,
      "TipoOpaco",
      false,
      "#c99fde",
    ],
    [
      "- Cerramientos en contacto con el terreno (O-G)",
      "O-G",
      ground.a,
      ground.au,
      "TipoOpaco",
      false,
      "#d3aa86",
    ],
    ["Puentes térmicos", "PTs", tbs_l, tbs_psil, "Tipo", true, "#447c2c"],
    [
      "- Cubierta o suelo con fachada (R)",
      "TB-R",
      tbs.roof.l,
      tbs.roof.psil,
      "TipoPT",
      false,
      "#c281ac",
    ],
    [
      "- Balcón (B)",
      "TB-B",
      tbs.balcony.l,
      tbs.balcony.psil,
      "TipoPT",
      false,
      "#c28bb5",
    ],
    [
      "- Esquina de fachadas (C)",
      "TB-C",
      tbs.corner.l,
      tbs.corner.psil,
      "TipoPT",
      false,
      "#eee8a4",
    ],
    [
      "- Frente de forjado (IF)",
      "TB-IF",
      tbs.intermediate_floor.l,
      tbs.intermediate_floor.psil,
      "TipoPT",
      false,
      "#bda7de",
    ],
    [
      "- Partición interior con envolvente (IW)",
      "TB-IW",
      tbs.internal_wall.l,
      tbs.internal_wall.psil,
      "TipoPT",
      false,
      "#d8eea8",
    ],
    [
      "- Elementos contra el terreno con fachada (GF)",
      "TB-GF",
      tbs.ground_floor.l,
      tbs.ground_floor.psil,
      "TipoPT",
      false,
      "#d3ca86",
    ],
    [
      "- Pilar (P)",
      "TB-P",
      tbs.pillar.l,
      tbs.pillar.psil,
      "TipoPT",
      false,
      "#98de7b",
    ],
    [
      "- Contorno de huecos (W)",
      "TB-W",
      tbs.window.l,
      tbs.window.psil,
      "TipoPT",
      false,
      "#91decf",
    ],
    [
      "- Genérico (G)",
      "TB-G",
      tbs.generic.l,
      tbs.generic.psil,
      "TipoPT",
      false,
      "#a200ff",
    ],
  ];

  const k_data = build_k_data(K, a, all_elements).filter(({ a }) => a > 0.001);

  return (
    <>
      <Row>
        <Col>
          <h3>Transmitancia térmica global (K)</h3>
          <p>
            Transmisión de calor a través de la envolvente térmica (huecos,
            opacos y puentes térmicos)
          </p>
          <p>
            H<sub>tr,adj</sub> &asymp; &sum;<sub>x</sub> b<sub>tr,x</sub> ·
            [&sum;
            <sub>i</sub> A<sub>x,i</sub> · U<sub>x,i</sub> (huecos + opacos) +
            &sum;<sub>k</sub> l<sub>x,k</sub> · ψ<sub>x,k</sub> (PTs)] ={" "}
            {windows_au.toFixed(2)} W/K (huecos) + {opaques_au.toFixed(2)} W/K
            (opacos) + {tbs_psil.toFixed(2)} W/K (PTs) = {au.toFixed(2)} W/K{" "}
          </p>
          <p>Superficie de intercambio de la envolvente térmica</p>
          <p>
            &sum;A = &sum; b<sub>tr,x</sub> · A<sub>x</sub> ={" "}
            {windows_a.toFixed(2)} m² (huecos) + {opaques_a.toFixed(2)} m²
            (opacos) = {a.toFixed(2)} m²
          </p>
          <p>Valor del indicador:</p>
          <p>
            <b>K</b> = H<sub>tr,adj</sub> / &sum;A &asymp; {au.toFixed(2)} /{" "}
            {a.toFixed(2)} ={" "}
            <b>
              {K.toFixed(2)} <i>W/m²K</i>
            </b>
          </p>
        </Col>
      </Row>
      <svg>
        <defs>
          <pattern
            id="pattern-diagonal"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect x="0" y="0" width="8" height="15" fill="white" />
          </pattern>
          <mask id="mask-diagonal">
            <rect width="2000" height="500" fill="url(#pattern-diagonal)" />
          </mask>
        </defs>
      </svg>
      <Row>
        <Col>
          {k_data.length > 0 ? <KElementsTable K={K} data={k_data} /> : null}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {k_data.length > 0 ? (
            <KElementsChart data={k_data} width={1200} />
          ) : null}
        </Col>
      </Row>
    </>
  );
};

// Tabla de desglose de K
const KElementsTable = ({ K, data }) => {
  const elem_tr = (
    { title, a, au, u_mean, k_contrib, k_pct, color, format = false },
    key = null
  ) => (
    <tr key={key}>
      <td style={{ width: "2em", background: `${color}` }}></td>
      <td>{formatted(title, format)}</td>
      <td className="text-center">{formatted(round_or_dash(a), format)}</td>
      <td className="text-center">{formatted(round_or_dash(au), format)}</td>
      <td className="text-center">
        {formatted(round_or_dash(u_mean), format)}
      </td>
      <td className="text-center">
        {formatted(round_or_dash(k_contrib), format)}
      </td>
      <td className="text-center">
        {formatted(round_or_dash(k_pct, 1), format)}
      </td>
    </tr>
  );

  return (
    <Table striped bordered hover size="sm" className="small">
      <thead style={{ background: "lightGray" }}>
        <tr>
          <th colSpan="2">Elemento</th>
          <th className="text-center">
            A o L<br />
            [m² o m]
          </th>
          <th className="text-center">
            A·U o ψ·L
            <br />
            [W/K]
          </th>
          <th className="text-center">
            U o ψ media
            <br />
            [W/m²K]
          </th>
          <th className="text-center">
            &Delta;K
            <br />
            [W/m²K]
          </th>
          <th className="text-center">
            K
            <br />
            [%]
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((e, idx) => elem_tr(e, idx))}
        <tr>
          <td colSpan="2">
            <b>TOTAL</b>
          </td>
          <td></td>
          <td></td>
          <td className="text-center">
            <b>{K.toFixed(2)}</b>
          </td>
          <td className="text-center">
            <b>{K.toFixed(2)}</b>
          </td>
          <td className="text-center">
            <b>100.0</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

// Genera datos a partir de lista
const build_k_data = (K, total_a, data) => {
  return data.map(([title, short_title, a, au, type, format, color]) => ({
    title,
    short_title,
    a,
    au,
    type,
    format,
    color,
    u_mean: U_mean(au, a),
    k_contrib: K_contrib(au, total_a),
    k_pct: K_pct(au, total_a, K),
  }));
};

const U_mean = (elem_au, elem_a) => {
  if (elem_a && elem_a > 0.0001) {
    return elem_au / elem_a;
  } else return null;
};

const K_contrib = (elem_au, a) => {
  if (a && a > 0.0001) {
    return elem_au / a;
  } else return null;
};

const K_pct = (elem_au, a, K) => {
  if (a && a > 0.0001 && K && K > 0.0001) {
    return (100 * elem_au) / a / K;
  } else return null;
};

export default observer(IndicatorsKDetail);
