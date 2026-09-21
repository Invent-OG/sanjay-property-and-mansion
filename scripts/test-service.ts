import * as dotenv from 'dotenv';
dotenv.config();

import { propertyService } from '../src/services/propertyService';

async function testService() {
  console.log('Testing propertyService.getFullPropertyBySlug()...');
  const res = await propertyService.getFullPropertyBySlug('sanjay-mansion');
  console.log('Property ID:', res.property.id);
  console.log('Accommodations:', res.accommodations.length, res.accommodations.map(a => `${a.name}: ${a.price_display}`));
  console.log('Facilities:', res.facilities.length);
  console.log('Meal Plans:', res.mealPlans.length);
  console.log('Meal Rates:', res.mealSubscriptionRates.length, res.mealSubscriptionRates.map(r => `${r.plan_type}: ${r.monthly_price}`));
  console.log('Weekly Menu:', res.weeklyMenu.length, res.weeklyMenu.map(m => m.day_of_week));
}

testService().catch(console.error);
