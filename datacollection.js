
function maskS2clouds(image) {
    var qa = image.select('QA60');
  
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
  
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
        .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
    return image.updateMask(mask).divide(10000);
  }
  
  // 19 - 20 - 21 
  var s = '2021-01-01';
  var e = '2021-01-31';
  
  var dataset = ee.ImageCollection('COPERNICUS/S2_SR')
                    .filterDate(s, e)
                    // Pre-filter to get less cloudy granules.
                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',5))
                    .map(maskS2clouds);
  
  var no2 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2')
    .select('NO2_column_number_density')
    .filterDate(s, e);
    
  var so2 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_SO2')
    .select('SO2_column_number_density')
    .filterDate(s, e);
  
  var hcho = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_HCHO')
    .select('tropospheric_HCHO_column_number_density')
    .filterDate(s, e);
    
  var co = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
    .select('CO_column_number_density')
    .filterDate(s, e);
  
  var o3 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_O3')
    .select('O3_column_number_density')
    .filterDate(s, e);
  
  var aer_ai = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_AER_AI')
    .select('absorbing_aerosol_index')
    .filterDate(s, e);
  
  var ch4 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CH4')
    .select('CH4_column_volume_mixing_ratio_dry_air')
    .filterDate(s, e);
    
  var img = ee.Image.cat([no2.mean(),so2.mean(),co.mean(),ch4.mean(),aer_ai.mean(),o3.mean(),hcho.mean()]);
  
  print('Collection: ', img);
  
  
  Export.image.toDrive({
    image: img,
    description: 'gowdavallipollution2021_Jan',
    scale: 10,
    region: geometry
  });
  
  
  Export.image.toDrive({
    image: dataset.mean(),
    description: 'gowdavalli2021_Jan',
    scale: 10,
    region: geometry
  });
  
  