
import React from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { EstimationInputs, Country } from '../types';
import { COLORS } from '../constants';
import { Info, Lock, Calculator, Copy, Loader2 } from 'lucide-react';
import { useConfig } from '../hooks/useEstimatorQueries';

interface Props {
  inputs: EstimationInputs;
  setInputs: React.Dispatch<React.SetStateAction<EstimationInputs>>;
  onGenerate: () => void;
}

const CostEstimatorForm: React.FC<Props> = ({ inputs, setInputs, onGenerate }) => {
  const { data: config, isLoading, error } = useConfig();

  // Transform countries from API to select options
  const countryOptions = React.useMemo(() => {
    if (!config?.countries) return [];
    return config.countries.map((country: Country) => ({
      value: country.name,
      label: `${country.name} (${country.code})`,
      country: country, // Store full country object for reference
    }));
  }, [config?.countries]);

  // Transform durations from API to select options
  const durationOptions = React.useMemo(() => {
    if (!config?.durations) return [];
    return config.durations.map((d: number) => ({
      value: d,
      label: `${d} months`,
    }));
  }, [config?.durations]);

  // Find host country for currency display
  const hostCountry = React.useMemo(() => {
    return config?.countries.find((c: Country) => c.name === inputs.hostCountry);
  }, [config?.countries, inputs.hostCountry]);

  const handleSelectChange = (name: keyof EstimationInputs) => (
    newValue: SingleValue<{ value: string | number; label: string }>
  ) => {
    if (newValue) {
      setInputs(prev => ({
        ...prev,
        [name]: newValue.value
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'dailyAllowance' || name === 'workingDaysPerMonth'
        ? (value === '' ? undefined : Number(value))
        : Number(value)
    }));
  };

  const InputLabel = ({ label, tooltip }: { label: string; tooltip?: string }) => (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-sm font-semibold text-[#83849E]">{label}</span>
      {tooltip && <Info size={14} className="text-[#EEEEEE] cursor-help" />}
    </div>
  );

  // Custom styles for react-select using brand colors
  const customSelectStyles: StylesConfig<{ value: string | number; label: string }, false> = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? COLORS.tealBlue : COLORS.lightGray,
      boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.tealBlue}` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? COLORS.tealBlue : COLORS.tealBlue,
      },
      borderRadius: '0.5rem',
      padding: '2px',
      fontSize: '0.875rem',
      color: COLORS.darkIndigo,
      backgroundColor: 'white',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? COLORS.tealBlue
        : state.isFocused
          ? COLORS.pastelBlue
          : 'white',
      color: state.isSelected ? 'white' : COLORS.darkIndigo,
      fontSize: '0.875rem',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: COLORS.tealBlue,
        color: 'white',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: COLORS.darkIndigo,
    }),
    placeholder: (base) => ({
      ...base,
      color: COLORS.lightSkyBlue,
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? COLORS.tealBlue : COLORS.lightSkyBlue,
      '&:hover': {
        color: COLORS.tealBlue,
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: COLORS.lightGray,
    }),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#40AEBC]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading configuration</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Failed to load countries and durations'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <InputLabel label="Home Country" />
          <Select
            styles={customSelectStyles}
            options={countryOptions}
            value={countryOptions.find(o => o.value === inputs.homeCountry)}
            onChange={handleSelectChange('homeCountry')}
            isLoading={isLoading}
          />
        </div>

        <div>
          <InputLabel label="Host Country" />
          <Select
            styles={customSelectStyles}
            options={countryOptions}
            value={countryOptions.find(o => o.value === inputs.hostCountry)}
            onChange={handleSelectChange('hostCountry')}
            isLoading={isLoading}
          />
          {hostCountry && (
            <p className="text-[10px] text-[#83849E] mt-1.5 uppercase tracking-wider font-medium">
              Currency: {hostCountry.currency}
            </p>
          )}
        </div>

        <div>
          <InputLabel label="Monthly Salary (EUR)" />
          <input
            type="number"
            name="monthlySalary"
            value={inputs.monthlySalary}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-white border border-[#EEEEEE] rounded-lg text-[#181C31] text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none transition-all"
          />
        </div>

        <div>
          <InputLabel label="Assignment Duration" />
          <Select
            styles={customSelectStyles}
            options={durationOptions}
            value={durationOptions.find(o => o.value === inputs.durationMonths)}
            onChange={handleSelectChange('durationMonths')}
          />
        </div>

        <div>
          <InputLabel label="Daily Allowance (EUR)" />
          <div className="relative">
            <input
              type="number"
              name="dailyAllowance"
              value={inputs.dailyAllowance ?? ''}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-white border border-[#EEEEEE] rounded-lg text-[#181C31] text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none transition-all"
            />
            <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EEEEEE]" />
          </div>
          {inputs.dailyAllowance && (
            <div className="mt-2 space-y-0.5">
              <p className="text-[10px] text-[#83849E]">Basis: {inputs.homeCountry} destination rate for {inputs.hostCountry}.</p>
              <p className="text-[10px] text-[#83849E]">Daily allowance locked at €{inputs.dailyAllowance.toFixed(2)}.</p>
              <p className="text-[10px] text-[#83849E]">Source: <span className="text-[#40AEBC] cursor-pointer font-semibold">Finnish Tax Admin 2026</span></p>
            </div>
          )}
        </div>

        <div>
          <InputLabel label="Working Days / Month" />
          <input
            type="number"
            name="workingDaysPerMonth"
            value={inputs.workingDaysPerMonth ?? 22}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-white border border-[#EEEEEE] rounded-lg text-[#181C31] text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-[#EEEEEE]/50">
        <button className="w-full sm:w-auto px-6 py-3 border border-[#EEEEEE] rounded-lg text-[#83849E] font-semibold hover:bg-[#F9FBFF] hover:border-[#40AEBC] hover:text-[#40AEBC] transition-all flex items-center justify-center gap-2 group">
          <Copy size={18} className="group-hover:scale-110 transition-transform" />
          Copy Estimate Summary
        </button>
        <button
          onClick={onGenerate}
          className="w-full sm:w-auto px-8 py-3 custom-gradient rounded-lg text-white font-bold shadow-lg shadow-[#40AEBC]/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Calculator size={18} />
          Generate Estimate
        </button>
      </div>
    </div>
  );
};

export default CostEstimatorForm;
