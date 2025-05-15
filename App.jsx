
// Complete Inspection Call System Website
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Inspection Call System</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <Button onClick={() => navigate('/raise-inspection')}>Raise Inspection Call</Button>
        <Button onClick={() => navigate('/psm')}>PSM</Button>
        <Button onClick={() => navigate('/tkil-qa')}>TKIL QA</Button>
        <Button onClick={() => navigate('/tpi-inspector')}>TPI Inspector</Button>
        <Button onClick={() => navigate('/inspection-result')}>Inspection Result</Button>
      </div>
    </div>
  );
};

const RaiseInspection = ({ setData }) => {
  const [form, setForm] = useState({
    psmMail: '', poNumber: '', callDate: '', inspectionDate: '',
    daysOfInspection: '', projectCode: '', projectName: '', contactName: '',
    contactMobile: '', vendorName: '', inspectionPlace: '', itemDescription: ''
  });

  const handleSubmit = () => {
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    const formData = { id, ...form };
    setData(prev => ({ ...prev, [id]: formData }));
    alert(`Inspection Call Generated: ${id}\nForm will be emailed to ${form.psmMail}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Raise Inspection Call</h2>
      <form className="grid grid-cols-1 gap-3">
        {Object.keys(form).map(key => (
          <input key={key} placeholder={key.replace(/([A-Z])/g, ' $1')} className="p-2 border" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
        ))}
        <button type="button" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

const FormWithCode = ({ label, setData, dataKey, data, fields }) => {
  const [code, setCode] = useState('');
  const [form, setForm] = useState(null);
  const handleSearch = () => {
    if (data[code]) setForm({ ...data[code], ...data[code][dataKey] });
    else alert("Invalid Inspection Call Number");
  };
  const handleSubmit = () => {
    const updated = { ...data[code], [dataKey]: form };
    setData(prev => ({ ...prev, [code]: updated }));
    const email = form[fields[1].key];
    alert(`${label} Data Submitted and mailed to ${email}`);
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      {!form && <><input placeholder="Enter Inspection Call Number" className="p-2 border mb-2 w-full" value={code} onChange={e => setCode(e.target.value)} /><button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700" onClick={handleSearch}>Search</button></>}
      {form && <div className="grid grid-cols-1 gap-3">
        {fields.map(f => (
          <input key={f.key} placeholder={f.label} className="p-2 border" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
        ))}
        <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700" onClick={handleSubmit}>Submit</button>
      </div>}
    </div>
  );
};

const TPIInspector = ({ setData, data }) => {
  const [code, setCode] = useState('');
  const [form, setForm] = useState(null);
  const handleSearch = () => {
    if (data[code]) setForm({ ...data[code], ...data[code].tpi });
    else alert("Invalid Inspection Call Number");
  };
  const handleSubmit = () => {
    const updated = { ...data[code], tpi: form };
    setData(prev => ({ ...prev, [code]: updated }));
    const email = data[code]?.tkilQA?.inspectionAgencyMail || 'QA Engineer';
    alert(`TPI Report sent to ${email}`);
  };
  const fields = [
    { key: 'inspectorName', label: 'Inspector Name' },
    { key: 'inspectionAgency', label: 'Inspection Agency' },
    { key: 'startDate', label: 'Start Date & Time' },
    { key: 'endDate', label: 'End Date & Time' },
    { key: 'reportNumber', label: 'Report Number' },
    { key: 'reportFile', label: 'Upload Inspection Report' },
    { key: 'remarks', label: 'Remarks' }
  ];
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">TPI Inspector</h2>
      {!form && <><input placeholder="Enter Inspection Call Number" className="p-2 border mb-2 w-full" value={code} onChange={e => setCode(e.target.value)} /><button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700" onClick={handleSearch}>Search</button></>}
      {form && <div className="grid grid-cols-1 gap-3">
        {fields.map(f => (
          <input key={f.key} placeholder={f.label} className="p-2 border" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
        ))}
        <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700" onClick={handleSubmit}>Submit</button>
      </div>}
    </div>
  );
};

const InspectionResult = ({ data }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Inspection Result</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Call No</th>
            <th className="p-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([id, record]) => (
            <tr key={id}>
              <td className="border p-2">{id}</td>
              <td className="border p-2 text-left whitespace-pre-wrap">{JSON.stringify(record, null, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState({});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/raise-inspection" element={<RaiseInspection setData={setData} />} />
        <Route path="/psm" element={<FormWithCode label="PSM Entry" setData={setData} dataKey="psm" data={data} fields={[{ key: 'psmContact', label: 'PSM Contact' }, { key: 'qaName', label: 'QA Engineer Name' }, { key: 'qaMail', label: 'QA Engineer Email' }]} />} />
        <Route path="/tkil-qa" element={<FormWithCode label="TKIL QA" setData={setData} dataKey="tkilQA" data={data} fields={[{ key: 'inspectionAgency', label: 'Inspection Agency' }, { key: 'inspectionAgencyMail', label: 'Inspection Agency Email' }]} />} />
        <Route path="/tpi-inspector" element={<TPIInspector setData={setData} data={data} />} />
        <Route path="/inspection-result" element={<InspectionResult data={data} />} />
      </Routes>
    </Router>
  );
};

export default App;
