-- Migration 013: Remove Craigslist listings and references
-- The Craigslist scraper has been disabled; clean up existing data and constraints.

-- 1. Delete all Craigslist listings (cascades to grades, search_result_listings,
--    user_listing_actions; nullifies agent_events.listing_id)
DELETE FROM listings WHERE source = 'craigslist';

-- 2. Update the CHECK constraint to only allow 'ebay'
ALTER TABLE listings DROP CONSTRAINT listings_source_check;
ALTER TABLE listings ADD CONSTRAINT listings_source_check CHECK (source IN ('ebay'));

-- 3. Remove craigslist_city from the default search_preferences
ALTER TABLE profiles
ALTER COLUMN search_preferences SET DEFAULT '{
  "category_id": "33710",
  "condition_ids": ["3000", "7000"],
  "excluded_keywords": ["parting out", "whole car", "complete vehicle"],
  "buying_options": ["FIXED_PRICE", "BEST_OFFER", "AUCTION"],
  "vehicle_year": null,
  "vehicle_make": null,
  "vehicle_model": null,
  "sort": "newlyListed",
  "max_price": null
}'::jsonb;

-- 4. Strip craigslist_city from existing profile rows
UPDATE profiles
SET search_preferences = search_preferences - 'craigslist_city'
WHERE search_preferences ? 'craigslist_city';
