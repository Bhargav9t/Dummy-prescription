
import React from 'react';
import { Prescription } from '../types';

interface Props {
  prescription: Prescription;
}

const PrescriptionCard: React.FC<Props> = ({ prescription }) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg shadow-sm p-8 max-w-2xl mx-auto font-serif relative overflow-hidden">
      {/* Header watermark/subtle branding */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-800">Mirth Connect Showcase</h1>
        <p className="text-xl font-semibold text-blue-800">{prescription.hospital_name}</p>
        <p className="text-xs text-slate-500 italic">Cardiac & Emergency Care Unit | 102nd Medical Dr, Health City</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p><span className="font-bold">Patient ID:</span> {prescription.patient.id}</p>
          <p><span className="font-bold">Name:</span> {prescription.patient.name}</p>
        </div>
        <div className="text-right">
          <p><span className="font-bold">Age/Gender:</span> {prescription.patient.age}Y / {prescription.patient.gender}</p>
          <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-md font-bold underline mb-2">Diagnosis:</h2>
        <p className="text-lg text-red-700 font-bold">{prescription.diagnosis}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-300 mb-4 select-none opacity-50">Rx</h2>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2">Medication</th>
              <th className="py-2">Dosage</th>
              <th className="py-2">Frequency</th>
              <th className="py-2">Route</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medications.map((med, idx) => (
              <tr key={idx} className="border-b border-slate-50">
                <td className="py-3 font-semibold">{med.type}. {med.name}</td>
                <td className="py-3">{med.dosage}</td>
                <td className="py-3">{med.frequency}</td>
                <td className="py-3 italic">{med.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-md font-bold underline mb-2">Advice & Follow-up:</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          {prescription.advice.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-end">
        <div className="text-[10px] text-slate-400">
          Generated for Mirth Connect Testing Purposes Only.
        </div>
        <div className="text-center">
          <div className="h-10 w-32 border-b border-slate-400 mb-1 mx-auto"></div>
          <p className="font-bold text-sm underline">{prescription.prescriber}</p>
          <p className="text-xs text-slate-500">Sr. Cardiologist</p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
