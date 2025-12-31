// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { verifyToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function GET() {
  try {
    // Verify admin token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !verifyToken(token, 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`SELECT * FROM HospitalSettings WHERE SettingID = 1`;
    
    if (result.rows.length === 0) {
      // Initialize settings if not exists
      await sql`
        INSERT INTO HospitalSettings (
          HospitalName, HospitalLogo, ContactEmail, ContactPhone, 
          Address, FacebookUrl, TwitterUrl, InstagramUrl, WorkingHours
        ) VALUES (
          'اسم المستشفى', '', '', '', '', '', '', '', 'من الأحد إلى الخميس، من 8 صباحاً إلى 4 مساءً'
        )
      `;
      const newResult = await sql`SELECT * FROM HospitalSettings WHERE SettingID = 1`;
      return NextResponse.json({ success: true, data: newResult.rows[0] });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin token
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !verifyToken(token, 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const updates: any = {};

    // Handle file upload
    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'settings');
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `hospital-logo-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const filePath = join(uploadDir, fileName);
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      updates.HospitalLogo = `/uploads/settings/${fileName}`;
    }

    // Handle other fields
    const fields = [
      'hospitalName', 'contactEmail', 'contactPhone', 'address',
      'facebookUrl', 'twitterUrl', 'instagramUrl', 'workingHours'
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        const dbField = field.charAt(0).toUpperCase() + field.slice(1);
        updates[dbField] = value;
      }
    });

    // Build the update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(updates);
    const query = {
      text: `UPDATE HospitalSettings SET ${setClause}, UpdatedAt = NOW() WHERE SettingID = 1 RETURNING *`,
      values
    };

    const result = await sql.query(query);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث الإعدادات' },
      { status: 500 }
    );
  }
}