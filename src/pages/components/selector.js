import { useRouter, usePathname } from 'next/navigation';
import { SearchKeys } from '@/types';

export const Selector = () => {
  const router = useRouter();
  const pathNameParams = new URLSearchParams(usePathname()?.replace('/', ''));
  const { location, budget, activity, startDate, endDate } = Object.fromEntries(pathNameParams);

  const submit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    if (!formProps[SearchKeys.Location] || !formProps['startDate'] || !formProps['endDate']) return;

    const newSearchParams = new URLSearchParams(formProps);

    router.push('/search?' + newSearchParams.toString());
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-xl">
      <div className="grid grid-cols-2 gap-6">
        {formField('From where do you want to plan your trip? *', SearchKeys.Location, 'text', location, 'Enter location', true)}
        {formField('Start Date *', 'startDate', 'date', startDate, '', true)}
        {formField('End Date *', 'endDate', 'date', endDate, '', true)}
        {formField('Activities', SearchKeys.Activity, 'select', activity, 'Select activities', false, activities)}
        {formField('Budget ($/month)', SearchKeys.Budget, 'number', budget, 'Enter budget')}
        <div className="col-span-2">
          <button className="btn btn-primary w-full">Suggest</button>
        </div>
      </div>
    </form>
  );
};

function formField(label, name, type, value, placeholder, required = false, options = []) {
  const inputClass = 'input input-bordered input-primary w-full';
  return (
    <div className="form-group">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'select' || type === 'multi-select' ? (
        <select
          name={name}
          required={required}
          className="select select-bordered select-primary w-full"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={value}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

const activities = [
  'Snowboarding', 'Skiing', 'Surfing', 'Chilling on the beach',
  'Hiking', 'Shopping', 'Sightseeing'
];