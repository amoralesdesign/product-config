import type { CategoryConfig, BusinessRule } from '../types/bike';

export const bikeCategories: CategoryConfig[] = [
  {
    id: 'frame-type',
    name: 'Frame Type',
    description: 'Select the frame type for your bike',
    required: true,
    order: 1,
    options: [
      {
        value: 'full-suspension',
        label: 'Full-suspension',
        price: 130,
        description: 'Full suspension frame for difficult terrain'
      },
      {
        value: 'diamond',
        label: 'Diamond',
        price: 100,
        description: 'Classic diamond-shaped frame'
      },
      {
        value: 'step-through',
        label: 'Step-through',
        price: 110,
        description: 'Low frame for easy access'
      }
    ]
  },
  {
    id: 'frame-finish',
    name: 'Frame Finish',
    description: 'Choose your frame finish',
    required: true,
    order: 2,
    options: [
      {
        value: 'matte',
        label: 'Matte',
        price: 30,
        description: 'Elegant matte finish'
      },
      {
        value: 'shiny',
        label: 'Shiny',
        price: 30,
        description: 'Eye-catching shiny finish'
      }
    ]
  },
  {
    id: 'wheels',
    name: 'Wheels',
    description: 'Select the appropriate wheels for your style',
    required: true,
    order: 3,
    options: [
      {
        value: 'road',
        label: 'Road wheels',
        price: 80,
        description: 'Lightweight wheels for asphalt'
      },
      {
        value: 'mountain',
        label: 'Mountain wheels',
        price: 120,
        description: 'Robust wheels for irregular terrain'
      },
      {
        value: 'fat-bike',
        label: 'Fat bike wheels',
        price: 150,
        description: 'Extra wide wheels for sand and snow'
      }
    ]
  },
  {
    id: 'rim-color',
    name: 'Rim Color',
    description: 'Customize your rim color',
    required: true,
    order: 4,
    options: [
      {
        value: 'red',
        label: 'Red',
        price: 25,
        description: 'Vibrant red rims'
      },
      {
        value: 'black',
        label: 'Black',
        price: 20,
        description: 'Classic black rims'
      },
      {
        value: 'blue',
        label: 'Blue',
        price: 20,
        description: 'Elegant blue rims'
      }
    ]
  },
  {
    id: 'chain',
    name: 'Chain',
    description: 'Choose your transmission system',
    required: true,
    order: 5,
    options: [
      {
        value: 'single-speed',
        label: 'Single-speed chain',
        price: 43,
        description: 'Simple and reliable system'
      },
      {
        value: '8-speed',
        label: '8-speed chain',
        price: 85,
        description: 'Versatile 8-speed system'
      }
    ]
  },
  {
    id: 'lights',
    name: 'Lights',
    description: 'Choose your transmission system',
    required: false,
    order: 6,
    options: [
      {
        value: 'lights xenon',
        label: 'sdfsdfsdfsdf',
        price: 5,
        description: 'Simple and reliable system'
      },
      {
        value: 'lights led',
        label: '8-speed chain',
        price: 3,
        description: 'Versatile 8-speed system'
      }
    ]
  }
];

export const businessRules: BusinessRule[] = [
  {
    id: 'mountain-wheels-frame-compatibility',
    name: 'Mountain Wheels Frame Compatibility',
    description: 'Mountain wheels require full-suspension frame',
    type: 'compatibility',
    conditions: {
      'wheels': ['mountain']
    },
    effects: {
      disableOptions: [
        {
          category: 'frame-type',
          values: ['diamond', 'step-through']
        }
      ]
    },
    active: true,
    priority: 1
  },
  {
    id: 'diamond-step-through-wheels-compatibility',
    name: 'Diamond/Step-through Wheels Compatibility',
    description: 'Diamond and step-through frames cannot use mountain wheels',
    type: 'compatibility',
    conditions: {
      'frame-type': ['diamond', 'step-through']
    },
    effects: {
      disableOptions: [
        {
          category: 'wheels',
          values: ['mountain']
        }
      ]
    },
    active: true,
    priority: 1
  },
  {
    id: 'fat-bike-red-compatibility',
    name: 'Fat Bike Red Compatibility',
    description: 'Fat bike wheels are not available in red',
    type: 'compatibility',
    conditions: {
      'wheels': ['fat-bike']
    },
    effects: {
      disableOptions: [
        {
          category: 'rim-color',
          values: ['red']
        }
      ]
    },
    active: true,
    priority: 1
  },
  {
    id: 'red-rim-fat-bike-compatibility',
    name: 'Red Rim Fat Bike Compatibility',
    description: 'Red rims cannot be used with fat bike wheels',
    type: 'compatibility',
    conditions: {
      'rim-color': ['red']
    },
    effects: {
      disableOptions: [
        {
          category: 'wheels',
          values: ['fat-bike']
        }
      ]
    },
    active: true,
    priority: 1
  },
  {
    id: 'matte-finish-pricing',
    name: 'Matte Finish Dynamic Pricing',
    description: 'Matte finish pricing varies by frame type: 30 EUR base, +20 EUR for full-suspension',
    type: 'pricing',
    conditions: {
      'frame-type': ['full-suspension'],
      'frame-finish': ['matte']
    },
    effects: {
      priceModifications: [
        {
          category: 'frame-finish',
          value: 'matte',
          modifier: 20,
          type: 'add'
        }
      ]
    },
    active: true,
    priority: 2
  }
];